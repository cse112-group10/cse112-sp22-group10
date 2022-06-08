import { database } from '../scripts/database.js';

// RecipeUpload.js
class UserPage extends HTMLElement {
  /**
   * Constructor builds the layout for the recipe page
   */
  constructor() {
    super();
    // Create Shadow DOM
    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('style');
    const article = document.createElement('article');

    this.isCreate = true;

    styles.innerHTML = `
      article {
        display: block;
        margin-left: auto;
        margin-right: auto;
        max-width: 50%;
        background-color: #ee6858;
        padding: 15px 30px;
        border-radius: 20px;
      }

      h1 {
        text-align: center;
      }

      textarea {
        width: 100%;
        margin: 5px;
      }


      button {
        font-size: 18px;
        background-color: transparent;
        cursor: pointer;
        font-weight: bold;
        padding-bottom: 2px;
        // height: 25px;
        // width: 20px;
        color: #767676;
        font-family: 'Mochiy Pop P One', sans-serif;
        box-sizing: border-box;
        line-height: 25px;
        //border: transparent;
        cursor: pointer;
        border-radius: 20px;
        font-family: 'Mochiy Pop P One', sans-serif;
      }

      @media (prefers-color-scheme: dark) {

        article {
          background-color: var(--bg-color-red);
        }

        h1,
        h2,
        h4,
        p,
        button,
        t,
        ul,
        li{
          color: var(--font-color);
        }

        input:not([type='button']) {
          background-color: var(--bg-color);
          color: var(--font-color);
        }

        input[type='button']{
          background-color: var(--bg-color);
          border: 2px solid var(--font-color);
          color: var(--font-color);
        }


      }

      
      .row {
        display: flex;
      }
      
      .column {
        flex: 50%;
      }
     
      
    `;

    article.innerHTML = `
    
    <h1 id="user-name">User Page</h1>

    <div class="row">
      <div class="column" style="align-self: left;">
        <h2>User Name</h2>
        <p>user-email</p>
      </div>
      <div class="column">
        <button>Change Password</button>
        <button>Change e-mail</button>
      </div>
    </div>

    <div>
      <button>EXPAND</button>
      <t color=var(--font-color)>|</t>
      <button>COLLAPSE</button>
    </div>

    <button type="button" class="collapsible">SAVED RECIPES</button>
    <div class="saved-recipes">
      <ul>
        <li>Recipe 1</li>
        <li>Recipe 2</li>
        <li>Recipe 3</li>
      </ul>   
    </div>

    <button type="button" class="collapsible">COMPLETED RECIPES</button>
    <div class="completed-recipes">
      <ul>
        <li>Recipe 1</li>
        <li>Recipe 2</li>
        <li>Recipe 3</li>
      </ul>   
    </div>

    <button type="button" class="collapsible">CHALLENGES</button>
    <div class="challenges">
      <ul>
        <li>Recipe 1</li>
        <li>Recipe 2</li>
        <li>Recipe 3</li>
      </ul>   
    </div>

    
    
    `;
    
    

    this.shadowRoot.append(styles, article);
  }
  
}

customElements.define('user-page', UserPage);
