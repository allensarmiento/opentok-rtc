import tokboxNexmoLogo from '../../assets/images/new-vonage-logo.png';

const DOM = {
  header: document.querySelector('.header')
};

export function addHeader(text) {
  DOM.header.insertAdjacentHTML('beforeend', headerView(text));
}

function headerView(isWebRTCVersion) {
  return `
    <h1>${isWebRTCVersion ? 'WebRTCDemo' : 'Vonage Demo by'}</h1>
    <img src="${tokboxNexmoLogo}" alt="opentok transparent logo">
    ${isWebRTCVersion ? `
      <h2>Built by Vonage on the OpenTok Platform</h2>
      <h3>This WebRTC Demo enables group video conferencing, text chat, screen sharing, and more.
    ` : ``}
  `; 
}

export function loadTosTemplate() {
  document.body.insertAdjacentHTML('beforeend', tosTemplateView());
}

function tosTemplateView() {
  return `
    <section class="tc-modal contract">
      <form class="tc-dialog">
        <i data-icon="close_gray" class="close"></i>
        <header>
          <span>Terms of Use</span>
        </header>
        <p>
          By accepting our terms of use your acknowledge that you have read the&nbsp;
          <a target="_blank" href="https://tokbox.com/support/privacy-policy">privacy policy</a>,&nbsp;
          and you are at least 18 years of age.
        </p>
        <footer>
          <button id="enter" class="btn tb btn-primary btn-arrow btn-next btn-padding accept">Accept and Continue</button>
        </footer>
      </form>
    </section>
  `;
}

