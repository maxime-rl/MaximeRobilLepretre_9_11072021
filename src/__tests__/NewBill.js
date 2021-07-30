import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock 
})

window.localStorage.setItem(
  'user',
  JSON.stringify({
    type: 'Employee',
  })
)

describe('GIVEN i am connected as an employee', () => {
  describe('WHEN i am on NewBill Page', () => {
    test('THEN the newBill page should be displayed', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe('When I am on NewBill Page and I Submit form with a file containing a valid extension', () => {
    test('THEN I should be redirected to Bills page', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      newBill.fileName = 'image.jpg';

      const submitBtnElt = screen.getByTestId('form-new-bill');
      submitBtnElt.addEventListener('submit', handleSubmit);
      fireEvent.submit(submitBtnElt);

      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();
    })
  })
  describe('When I am on NewBill Page and I Submit form with a file containing a invalid extension', () => {
    test('THEN I should stay on the new bill page and a error message should displayed', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });

      const handleSubmit = jest.fn(newBill.handleSubmit);
      newBill.fileName = 'invalid';

      const submitBtnElt = screen.getByTestId('form-new-bill');
      submitBtnElt.addEventListener('submit', handleSubmit);
      fireEvent.submit(submitBtnElt);

      expect(handleSubmit).toHaveBeenCalled();
      expect(document.querySelector(".error-extension").style.display).toBe("block")
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    })
  })
})