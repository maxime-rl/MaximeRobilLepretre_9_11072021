import { screen } from "@testing-library/dom"
import  userEvent  from '@testing-library/user-event'
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Bills from "../containers/Bills.js"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import firebase from "../__mocks__/firebase";
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
  describe('WHEN i am on bills Page and there are no bills', () => {
    test("THEN bills should be empty", () => {
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html

      const eyeIconElt = screen.queryByTestId('icon-eye')
      expect(eyeIconElt).toBeNull()
    })
  })
  describe('WHEN i am on bills Page and there are bills', () => {
    test('THEN bills should be ordered from earliest to latest', () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const dates = Array.from(document.body.querySelectorAll('#data-table tbody>tr>td:nth-child(3)')).map((a) => a.innerHTML)

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe('WHEN i am on bills Page and there are bills but it is loading', () => {
      test('THEN Loading page should be displayed', () => {
        const html = BillsUI({ loading: true })
        document.body.innerHTML = html

        expect(screen.getAllByText('Loading...')).toBeTruthy()
      })
    })
    describe('WHEN i am on bills Page and there are bills but back-end send an error message', () => {
      test('THEN Error page should be displayed', () => {
        const html = BillsUI({ error: 'some error message' })
        document.body.innerHTML = html

        expect(screen.getAllByText('Erreur')).toBeTruthy()
      })
    })
    describe('WHEN i click on the button for create a new bill', () => {
      test('THEN the add billing note page should open', () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html

        const billsOnUI = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage
        })
        const handleClickNewBill = jest.fn((e) => billsOnUI.handleClickNewBill(e)) 
        const newBillBtnElt = screen.getByTestId('btn-new-bill')

        newBillBtnElt.addEventListener('click', handleClickNewBill)
        userEvent.click(newBillBtnElt)

        expect(handleClickNewBill).toHaveBeenCalled()
      })
    })
    describe('WHEN i click on a bill icon eye', () => {
      test('THEN a modal should open', () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html

        const billsOnUI = new Bills({
            document,
            onNavigate,
            firestore: null,
            localStorage: window.localStorage
        })

        $.fn.modal = jest.fn()

        const iconEyeElt = screen.getAllByTestId('icon-eye')[0]
        const handleClickIconEye = jest.fn(() => billsOnUI.handleClickIconEye(iconEyeElt))

        iconEyeElt.addEventListener('click', handleClickIconEye)
        userEvent.click(iconEyeElt)
        expect(handleClickIconEye).toHaveBeenCalled()

        const modalElt = document.getElementById('modaleFile')
        expect(modalElt).toBeTruthy()
      })
    })
  })
})

// START Integration test
describe('GIVEN i am a user connected as Emplyee', () => {
  describe('WHEN i navigate to bills pages', () => {
    test('THEN fetches bills from mock API GET', async () => {
      const getSpy = jest.spyOn(firebase, 'get')
      const bills = await firebase.get()

      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })

    test('THEN fetches bills from an API and fails with 404 message error', async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 404'))
      )
      const html = BillsUI({ error: 'Erreur 404' })
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 404/)

      expect(message).toBeTruthy()
    })

    test('THEN fetches messages from an API and fails with 500 message error', async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error('Erreur 500'))
      )
      const html = BillsUI({ error: 'Erreur 500' })
      document.body.innerHTML = html
      const message = screen.getByText(/Erreur 500/)

      expect(message).toBeTruthy()
    })
  })
})