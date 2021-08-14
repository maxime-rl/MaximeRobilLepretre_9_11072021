import { screen, fireEvent } from '@testing-library/dom'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import { ROUTES } from '../constants/routes'
import { localStorageMock } from '../__mocks__/localStorage.js'
import firebase from '../__mocks__/firebase'
import BillsUI from '../views/BillsUI.js'

// Setup for test
Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock 
})

window.localStorage.setItem(
  'user',
  JSON.stringify({
    type: 'Employee'
  })
)

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

// START Unit test
describe('GIVEN i am connected as an employee', () => {
  describe('WHEN i am on NewBill Page', () => {
    test('THEN the newBill page should be displayed', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe('When I am on NewBill Page and I add a file', () => {
    test('Then this new file should be modified in the input file', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");

      inputFile.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(['image.gif'], 'image.gif', { type: 'image/gif' })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe('image.gif');
    });
  });
  describe('When I am on NewBill Page and I add a file containing a invalid extension', () => {
    test('THEN a error message should be displayed', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      });

      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId('file');

      inputFile.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(['image.gif'], 'image.gif', { type: 'image/gif' })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(document.querySelector('.error-extension').style.display).toBe('block')
    })
  })
  describe('WHEN I am on NewBill Page and I try to Submit form with a file containing a invalid extension', () => {
    test('THEN I should stay on the NewBill page', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      });

      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = ''

      const submitBtnElt = screen.getByTestId('form-new-bill')
      submitBtnElt.addEventListener('submit', handleSubmit)
      fireEvent.submit(submitBtnElt)

      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe('WHEN I am on NewBill Page and I Submit form with a file containing a valid extension', () => {
    test('THEN I should be redirected to Bills page', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      });

      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = 'image.jpg'

      const submitBtnElt = screen.getByTestId('form-new-bill')
      submitBtnElt.addEventListener('submit', handleSubmit)
      fireEvent.submit(submitBtnElt)

      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
})


// START Integration test
describe('GIVEN I am a user connected as an Employee', () => {
  describe('WHEN I navigate to NewBill page and post a new bill', () => {
    test('THEN it add a new bill on API with success', async () => {
      const newBill = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Transports",
        "commentary": "",
        "name": "Car rent",
        "fileName": "image.jpg",
        "date": "2021-07-30",
        "amount": 375,
        "commentAdmin": "",
        "email": "a@a",
        "pct": 20
      }

      const postSpy = jest.spyOn(firebase, 'post')
      const bills = await firebase.post(newBill)

      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
    test('THEN it fails and returns an 500 message error on Bills page', async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 500'))
      )

      const html = BillsUI({ error: 'Erreur 500' })
      document.body.innerHTML = html
      const message = screen.getByText(/Erreur 500/)

      expect(message).toBeTruthy()
    })
  })
})
