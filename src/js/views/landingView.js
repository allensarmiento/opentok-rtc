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
      </form>
    </section>
  `;
}

