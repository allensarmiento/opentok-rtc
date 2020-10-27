/* OpenTok network test - see https://github.com/opentok/opentok-network-test */ 

/* NOTES
 * The bandwidth calculator can probably be refactored out.
 */

import OT from '@opentok/client';
import * as BrowserUtils from '../utils/browserUtils';

const TEST_TIMEOUT_MS = 15000; // 15 seconds

class OTNetworkTest() {
  /**
   * @param {object} options Options for publisher instance.
   */
  constructor(options) {
    if (!(apiKey && sessionId && token)) {
      throw new Error('OTNetworkTest requires an apiKey, sessionId and token.');
    }
    this.apiKey = options.apiKey;
    this.sessionId = options.sessionId;
    this.token = options.token;

    // Placeholder for rendering subscriber and publisher.
    this.subscriberEl = document.createElement('div');
    this.publisherEl = document.createElement('div');

    // OT instances.
    this.session = null;
    this.publisher = OT.initPublisher(publisherEl, options);
    this.subscriber = null;

    // Network test variables.
    this.bandwidthCalculator = null;
    this.getStatsIntervalId = null;
    this.testTimeoutId = null;
    this.currentStats = null;
  }

  /**
   * @param {function} callback
   */
  startNetworkTest(callback) {
    // You cannot use the network test in IE. IE cannot subscribe to its 
    // own stream.
    if (BrowserUtils.isIE()) {
      return;
    }

    this.publisher.publishVideo(true);
    
    const callbacks = {
      onInitPublisher: this.onInitPublisher,
      onPublish: this.onPublish,
      cleanup: this.cleanup,
      onSubscribe: this.onSubscribe,
      onConnect: this.onConnect
    };

    this.compositeOfCallbacks(
      callbacks,
      ['onInitPublisher', 'onConnect'],
      error => { if (error) return; }
    );

    callbacks.onInitPublisher();

    // This publisher uses the default resolution (640x480 pixels) and frame
    // rate (30fps). For other resolutions you may need to adjust the 
    // bandwidth conditions in testStreamingCapability().
    this.publisher.on('streamDestroyed', event => {
      // Do not remove the preview publisher from the page.
      event.preventDefault();
    });

    this.session = OT.initSession(this.apiKey, this.sessionId);
    this.session.connect(this.token, callbacks.onConnect);
  }

  onInitPublisher(error) {
    if (error) {
      console.error('Could not acquire your camera and microphone.', error);
    }
  }

  onPublish(error) {
    if (error) {
      // handling publishing errors here
      console.error('Could not publish video.', error);
      return;
    }

    this.subscriber = this.session.subscribe(
      this.publisher.stream,
      this.subscriberEl,
      {
        audioVolume: 0,
        testNetwork: true
      },
      this.onSubscribe
    );
  }

  cleanup() {
    this.session.disconnect();
  }

  onSubscribe(error, subscriber, callback) {
    if (error) {
      console.error('Could not subscribe to video.', error);
      return;
    }

    this.testStreamingCapability(subscriber, (error, result) => {
      callback(error, result) ;
      this.cleanup();
    });
  }

  onConnect(error) {
    if (error) {
      console.error('Could not connect to OpenTok.', error);
    }

    this.session.publish(this.publisher, this.onPublish);
  }

  /**
   * @param {object} obj
   * @param {array} fns Array of function names
   * @param {function} callback
   */
  function compositeOfCallbacks(obj, fns, callback) {
    let results = {};
    let hasError = false;

    fns.forEach(key => {
      let originalCallback = obj[key];
      obj[key] = error => {
        results[key] = { error, args: Array.prototype.slice.call(arguments, 1) };

        if (error) {
          hasError = true;
        }

        originalCallback.apply(obj, arguments);
        checkDone();
      };
    });

    function checkDone() {
      if (Object.keys(results).length === fns.length) {
        callback(hasError, results);
        callback = () => {};
      }
    }
  }

  /**
   * @param {OTSubscriber} subscriber
   * @param {function} callback
   */
  testStreamingCapability(subscriber, callback) {
    this.performQualityTest(
      { subscriber, Timeout: TEST_TIMEOUT_MS }, 
      (error, results) => {
        this.evaluateResults(results, callback);
      }
    );
  }

  /**
   * @param {object} config
   * @param {function} callback
   */
  performQualityTest(config, callback) {
    const startMs = new Date().getTime();

    // Set the bandwidth calculator.
    this.bandwidthCalculator = this.bandwidthCalculatorObj({
      subscriber: config.subscriber
    });

    // Set a timeout for cleanup.
    this.testTimeoutId = window.setTimeout(
      this.cleanupAndReport(startMs, callback), 
      config.timeout
    );

    // Start the test.
    this.bandwidthCalculator.start(stats => void this.currentStats = stats);
  }

  /**
   * @param {object} config
   * @return {object} 
   */
  bandwidthCalculatorObj(config) {
    config.pollingInterval = config.pollingInterval || 500;
    config.windowSize = config.windowSize || 2000;
    config.subscriber = config.subscirber || undefined;

    return {
      start: reportFunction => void this.start(config, reportFunction),
      stop: () => void this.stop()
    };
  }

  /**
   * @param {object} config
   * @param {function} reportFunction
   */
  start(config, reportFunction) {
    let statsBuffer = [];
    let last = { audio: {}, video: {} };

    this.getStatsIntervalId = window.setInterval(function() {
      config.subscriber.getStats(function(error, stats) {
        let activeMediaTypes = 
          Object.keys(stats).filter(key => key !== 'timestamp');
        let snapshot = {};
        let nowMs = new Date().getTime();
        let sampleWindowSize;

        activeMediaTypes.forEach(type => {
          snapshot[type] = Object.keys(stats[type]).reduce(result, key) => {
            result[key] = stats[type][key] - (last[type][key] || 0);
            last[type][key] = stats[type][key];
            return result;
          }, {});
        });

        // Get a snapshot of now, and keep the last values for next round.
        snapshot.timestamp = stats.timestamp;

        statsBuffer.push(snapshot);
        statsBuffer = statsBuffer
          .filter(value => nowMs - value.timestamp < config.windowSize);

        sampleWindowSize = this.getSampleWindowSize(statsBuffer);

        if (sampleWindowSize !== 0) {
          reportFunction(this.calculatePerSecondStats(
            statsBuffer,
            sampleWindowSize + (config.pollingInterval / 1000)
          ));
        }
      });
    }, config.pollingInterval);
  }

  /**
   * @param {array} samples
   */
  getSampleWindowSize(samples) {
    const times = this.pluck(samples, 'timestamp');
    return ( max(times) - min(times) ) / 1000;
  }

  /**
   * NOTE: Is this like the filter command?
   * @param {array} arr
   * @param {string} propertyName
   */
  pluck(arr, propertyName) {
    return arr.map(value => value[propertyName]);
  }

  /**
   * @param {array} arr
   */
  max(arr) {
    return Math.max.apply(undefined, arr);
  }

  /**
   * @param {array} arr
   */
  function min(arr) {
    return Math.min.apply(undefined, arr);
  }

  /**
   * @param {array} statsBuffer
   * @param {number} seconds
   * @return {object} Stats.
   */
  function calculatePerSecondStats(statsBuffer, seconds) {
    let stats = {};
    let activeMediaTypes = Object.keys(statsBuffer[0] || {})
      .filter(key => key !== 'timestamp');

    activeMediaTypes.forEach(type => {
      stats[type] = {
        packetsPerSecond: sum( pluck(statsBuffer, type), 'packetsReceived' ) / seconds,
        bitsPerSecond: (sum( pluck(statsBuffer, type), 'bytesReceived' ) * 8) / seconds,
        packetsLostPerSecond: sum( pluck(statsBuffer, type), 'packetsLost' ) / seconds
      };

      stats[type].packetLossRatio = (
        stats[type].packetsLostPerSecond / stats[type].packetsPerSecond
      );
    });

    stats.windowSize = seconds;
    return stats;
  }

  /**
   * @param {array} arr
   * @param {string} propertyName
   */
  function sum(arr, propertyName) {
    if (typeof propertyName !== 'undefined') {
      arr = this.pluck(arr, propertyName);
    }

    return arr.reduce((previous, current) => previous + current, 0);
  }

  /** */
  function stop() {
    window.clearInterval(this.getStatsIntervalId);
    window.clearTimeout(this.testTimeoutId);
  }

  /** 
   * @param {number} startMs
   */
  function cleanupAndReport(startMs, callback) {
    this.currentStats.elapsedTimeMs = new Date().getTime() - startMs;

    this.bandwidthCalculator.stop();
    callback(undefined, this.currentStats);
    callback = () => {}; // NOTE: Is this needed?
  }

  /**
   * @param {object} results
   * @param {function} callback
   * @return {function}
   */
  function evaluateResults(results, callback) {
    // If we tried to set video constraints, but no video was found.
    if (!results.video) {
      const audioSupported = results.audio.bitsPerSecond > 25000 && 
        results.audio.packetLossRatio < 0.05;

      if (audioSupported) {
        return callback(false, {
          text: 'You can\'t send video because no camera was found, ' +
            'but your bandwidth can support an audio-only stream.',
          classification: 'precall-warning',
          audio: results.audio,
          video: null,
          audioOnly: true
        });
      }

      return callback(false, {
        text: 'You can\'t send video because no camera was found, ' +
          'and your bandwidth is too low for an audio-only stream',
        classification: 'precall-error',
        audio: results.audio,
        video: null
      });
    }

    const audioVideoSupported = results.video.bitsPerSecond > 250000 &&
      results.video.packetLossRatio < 0.03 &&
      results.audio.bitsPerSecond > 25000 &&
      results.audio.packetLossRatio < 0.05;

    if (audioVideoSupported) {
      return callback(false, {
        text: 'You\'re all set!',
        classification: 'precall-tick',
        audio: results.audio,
        video: results.video
      });
    }

    if (results.audio.packetLossRatio < 0.05) {
      return callback(false, {
        text: 'Your bandwidth can support audio only.',
        classification: 'precall-warning',
        audio: results.audio,
        video: results.video,
        audioOnly: true
      });
    }

    // try audio only to see if it reduces the packet loss
    // TODO
    this.publisher.publishVideo(false);

    this.performQualityTest({ subscriber, timeout: 5000 }, (error, results) => {
      const audioSupported = results.audio.bitsPerSecond > 250000 &&
        results.audio.packetLossRatio < 0.05;

      if (audioSupported) {
        return callback(false, {
          text: 'Your bandwidth can support audio only.',
          classification: 'precall-warning',
          audio: results.audio,
          video: results.video,
          audioOnly: true
        });
      }

      return callback(false, {
        text: 'Your bandwidth is too low for video or audio.',
        classification: 'precall-error',
        audio: results.audio,
        video: results.video
      });
    });
  }
}

export default OTNetworkTest;

