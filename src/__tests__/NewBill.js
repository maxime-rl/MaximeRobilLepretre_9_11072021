import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";

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
  describe("When I am on NewBill Page and I add a file", () => {
    test("Then this new file should be modified in the input file", () => {
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

      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["image.jpg"], "image.jpg", { type: "image/jpg" })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(inputFile.files[0].name).toBe("image.jpg");
    });
  });
  describe('When I am on NewBill Page and I Submit form with a file containing a valid extension', () => {
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
  describe('When I am on NewBill Page and I Submit form with a file containing a invalid extension', () => {
    test('THEN I should stay on the NewBill page and a error message should be displayed', () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      });

      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = 'invalid'

      const submitBtnElt = screen.getByTestId('form-new-bill')
      submitBtnElt.addEventListener('submit', handleSubmit)
      fireEvent.submit(submitBtnElt)

      expect(handleSubmit).toHaveBeenCalled()
      expect(document.querySelector(".error-extension").style.display).toBe("block")
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
})