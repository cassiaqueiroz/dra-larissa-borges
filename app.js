class FormSubmit {
  constructor(settings) {
    this.settings = settings;
    this.form = document.querySelector(settings.form);
    this.formButton = document.querySelector(settings.button);
    if (this.form) {
      this.url = this.form.getAttribute("action");
    }
    this.sendForm = this.sendForm.bind(this);
  }

  /**
   * Exibe a mensagem de sucesso
   */
  displaySuccess() {
    this.form.innerHTML = this.settings.success;
  }

  /**
   * Exibe a mensagem de erro
   */
  displayError() {
    this.form.innerHTML = this.settings.error;
  }

  /**
   * Gera um objeto com os campos do formulário
   */
  getFormObject() {
    const formObject = {};
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value.trim();
    });
    return formObject;
  }

  /**
   * Exibe mensagem de envio e desabilita o botão durante o processo
   */
  onSubmission(event) {
    event.preventDefault();
    this.formButton.disabled = true;
    this.formButton.innerText = "Enviando...";
  }

  /**
   * Validação de campos obrigatórios
   */
  validateForm() {
    let isValid = true;
    const fields = this.form.querySelectorAll("[name][required]");
    fields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add("error");
      } else {
        field.classList.remove("error");
      }
    });

    if (!isValid) {
      this.formButton.disabled = false;
      this.formButton.innerText = "Enviar";
    }

    return isValid;
  }

  /**
   * Envia o formulário via fetch
   */
  async sendForm(event) {
    try {
      this.onSubmission(event);

      if (!this.validateForm()) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(this.getFormObject()),
      });

      if (response.ok) {
        this.displaySuccess();
      } else {
        this.displayError();
      }
    } catch (error) {
      this.displayError();
      console.error("Erro no envio do formulário:", error);
    }
  }

  /**
   * Inicializa a classe e adiciona o evento ao botão
   */
  init() {
    if (this.form) {
      this.formButton.addEventListener("click", this.sendForm);
    }
    return this;
  }
}

// Inicialização
const formSubmit = new FormSubmit({
  form: "[data-form]",
  button: "[data-button]",
  success: "<h3 class='success'>Sua mensagem foi enviada. Agradecemos seu contato.</h3>",
  error: "<h3 class='error'>Não foi possível enviar sua mensagem. Tente novamente mais tarde.</h3>",
});
formSubmit.init();
