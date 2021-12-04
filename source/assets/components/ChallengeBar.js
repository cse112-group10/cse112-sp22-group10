// ChallengeBar.js
// Taken from Lab 7

/**
 * Creates recipe card and appends it to the main page.
 * @param {json} data The json containing the data to create the card.
 */
class ChallengeBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(data) {
    if (!data) return;

    const challenge = document.createElement('article');
    const style = document.createElement('style');

    style.innerHTML = `
      h3 {
        font-family: 'Mochiy Pop P One', sans-serif;
      }
      .progress {
        width: 100%;
        background-color: var(--ec-white);
        border-radius: 20px
      }
      .my-bar {
        width: 0%;
        height: 30px;
        background-color: var(--ec-spicy5);
        text-align: center;
        line-height: 30px;
        color: rgb(241, 235, 235);
        border-radius: 20px
      }
    `;

    const elem = document.createElement('div');
    elem.classList.add('challenge-bar');

    const title = document.createElement('h3');
    title.classList.add('challenge-title');
    title.innerText = data.title;
    elem.appendChild(title);

    const progress = document.createElement('div');
    progress.classList.add('progress');
    const bar = document.createElement('div');
    bar.classList.add('my-bar');
    progress.appendChild(bar);
    elem.appendChild(progress);

    const width = Math.round((data.numberCompleted / data.total) * 100);
    const id = setInterval(frame, 10);
    /**
     * Sets the interval for the progress bar
     */
    function frame() {
      if (width > 100) {
        clearInterval(id);
      } else {
        bar.style.width = `${width}%`;
        bar.innerHTML = `${width}%`;
      }
    }

    challenge.append(elem);
    this.shadowRoot.append(style, elem);
  }
}

customElements.define('challenge-bar', ChallengeBar);