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

  displaySuccess() {
    this.form.innerHTML = this.settings.success;
  }

  displayError() {
    this.form.innerHTML = this.settings.error;
  }

  getFormObject() {
    const formObject = {};
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value;
    });
    return formObject;
  }

  validateFields() {
    const fields = this.form.querySelectorAll("[name]");
    let isValid = true;

    fields.forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("error");
        isValid = false;
      } else {
        field.classList.remove("error");
      }

      if (field.getAttribute("name") === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          field.classList.add("error");
          isValid = false;
        } else {
          field.classList.remove("error");
        }
      }
    });

    return isValid;
  }

  onSubmission(event) {
    event.preventDefault();
    this.formButton.disabled = true;
    this.formButton.innerText = "Enviando...";
  }

  async sendForm(event) {
    try {
      if (!this.validateFields()) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
      }
      this.onSubmission(event);
      await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(this.getFormObject()).toString(),
      });

      // Verifica se é o formulário de cotação
      if (this.form.id === "quote-form") {
        // Redireciona para a página de confirmação
        window.location.href = "confirmation.html";
      } else {
        // Exibe a mensagem de sucesso para outros formulários
        this.displaySuccess();
      }
    } catch (error) {
      this.formButton.disabled = false;
      this.formButton.innerText = "Enviar mensagem";
      this.displayError();
      console.error(error);
    }
  }

  init() {
    if (this.form) this.formButton.addEventListener("click", this.sendForm);
    return this;
  }
}

const formSubmit = new FormSubmit({
  form: "[data-form]",
  button: "[data-button]",
  success: "<h3 class='success'>Sua mensagem foi enviada. Agradecemos seu contato!</h3>",
  error: "<h3 class='error'>Não foi possível enviar sua mensagem.</h3>",
});
formSubmit.init();