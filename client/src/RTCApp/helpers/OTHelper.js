import OT from '@opentok/client';

class OTHelper {
  constructor() {
    this.session = null;
    this.publisher = null;
    this.publisherInitialized = null;

    this.publishOptions = null;
    // We will use this in case the first publish fails. On the error we
    // will give the caller a proimse that will fulfill when/if the
    // publish succeeds at the same future time (because of a retry).
    this.solvePublisherPromise = null;
    this.publisherPromise = new Promise((resolve) => {
      this.solvePublisherPromise = resolve;
    });
  }

  /** */
  isPublisherReady() {
    return this.publisherInitialized;
  }

  /** */
  publisherHas(type) {
    const audioType = type.toLowerCase() === 'audio' && 'Audio';
    const confirmedType = audioType || 'Video';
    return this.publisher.stream[`has${confirmedType}`];
  }

  /** */
  togglePublisherAudio(value) {
    this.togglePublisherProperty('Audio', value);
  }

  togglePublisherVideo(value) {
    this.togglePublisherProperty('Video', value);
  }

  togglePublisherProperty(property, value) {
    this.publisherReady().then((publisher) => {
      publisher[`publish${property}`](value);
    });
  }

  /** */
  publisherReady() {
    const hasPublisher = this.publisher && this.publisherPromise;
    const hasOptions = this.publishOptions && this.retryPublish();
    return hasPublisher || hasOptions || Promise.reject();
  }

  retryPublish() {
    const { elem, properties, handlers } = this.publishOptions;
    return this.publish(elem, properties, handlers);
  }

  publish(elem, properties, handlers) {
    const self = this;
    this.publishOptions = null;
    const propCopy = {};

    Object.keys(properties).forEach((key) => {
      propCopy[key] = properties[key];
    });

    return new Promise((resolve, reject) => {
      this.publisher = OT.initPublisher(elem, properties, (error) => {
        if (error) {
          this.processError(
            elem,
            properties,
            handlers,
            reject,
            {
              name: error.name,
              message: `Error initializing publisher. ${error.message}`,
            },
          );

          return;
        }

        this.session.publish(this.publisher, (publisherError) => {
          if (error) {
            this.processError(
              elem,
              properties,
              handlers,
              reject,
              publisherError,
            );
          } else {
            this.publisherInitialized = true;

            Object.keys(handlers).forEach((name) => {
              // ? See what this line does
              this.publisher.on(name, handlers[name].bind(self));
            });

            this.solvePublisherPromise(this.publisher);
            resolve(this.publisher);
          }
        });
      });
    });
  }

  processError(elem, properties, handlers, reject, error) {
    this.publishOptions = { elem, properties, handlers };
    this.publisher = null;

    reject({ error, publisherPromise: this.publisherPromise });
  }
}

export default OTHelper;
