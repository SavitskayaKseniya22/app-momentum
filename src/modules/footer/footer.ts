import logo from "../../assets/images/GitHub_Logo_White.png";
import "./footer.scss";

class Footer extends HTMLElement {
  private initialized = false;
  render() {
    this.insertAdjacentHTML(
      "afterbegin",
      `
      <a href="https://github.com/SavitskayaKseniya22" target="_blank">
        <img src=${logo} alt="logo" class="footer__logo" />
      </a>
      <span>© 2023</span>
    `,
    );
  }

  connectedCallback() {
    this.classList.add("footer");
    if (this.initialized) return;
    this.initialized = true;
    this.render();
  }
}

export default Footer;
