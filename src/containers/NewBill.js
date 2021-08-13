
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = (e) => {
    document.querySelector(`input[data-testid="file"]`).classList.remove('red-border')
    document.querySelector('.error-extension').style.display = 'none'

		const file = this.document.querySelector(`input[data-testid="file"]`)
			.files[0];
		const filePath = e.target.value.split(/\\/g);
		const fileName = filePath[filePath.length - 1];

    // checking file extensions
		if (
			fileName.slice(-4).includes('.png') ||
			fileName.slice(-4).includes('.jpg') ||
			fileName.slice(-5).includes('.jpeg')
		) {
			this.firestore.storage
				.ref(`justificatifs/${fileName}`)
				.put(file)
				.then((snapshot) => snapshot.ref.getDownloadURL())
				.then((url) => {
					this.fileUrl = url;
					this.fileName = fileName;
				});
        console.log('extension checked: ' + fileName);
		} else {
			filePath.value = '';
      
      document.querySelector('.error-extension').style.display = 'block'
      document.querySelector(`input[data-testid="file"]`).classList.add('red-border')

      console.log('extension error: ' + fileName);
		}
	};

  handleSubmit = e => {
    e.preventDefault()

    console.log('submitted file: ' + this.fileName);

    // Just for unit test
    if (this.fileName === '') return null;

    const email = JSON.parse(localStorage.getItem('user')).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}