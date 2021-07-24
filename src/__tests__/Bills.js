import { screen } from "@testing-library/dom"
import  userEvent  from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"
import Bills from "../containers/Bills.js"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"


describe("GIVEN i am connected as an employee", () => {
  describe("WHEN i am on bills Page and there are no bills", () => {
    test("THEN bills should be empty", () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;

      const eyeIconElt = screen.queryByTestId("icon-eye")
      expect(eyeIconElt).toBeNull()
    })
  })
  describe("WHEN i am on bills Page and there are bills", () => {
    test("THEN bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const dates = Array.from(document.body.querySelectorAll("#data-table tbody>tr>td:nth-child(3)")).map((a) => a.innerHTML);

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe("WHEN I click on the button for create a new bill", () => {
      test("THEN the add billing note page should open", () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

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
    describe('WHEN I click on a bill icon eye', () => {
      test('THEN a modal should open', () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const billsOnUI = new Bills({
            document,
            onNavigate,
            firestore: null,
            localStorage: window.localStorage,
        })

        $.fn.modal = jest.fn();

        const iconEyeElt = screen.getAllByTestId("icon-eye")[0];
        const handleClickIconEye = jest.fn(() => billsOnUI.handleClickIconEye(iconEyeElt));

        iconEyeElt.addEventListener("click", handleClickIconEye);
        userEvent.click(iconEyeElt)
        expect(handleClickIconEye).toHaveBeenCalled();

        const modalElt = document.getElementById("modaleFile");
        expect(modalElt).toBeTruthy();
      })
    })
  })
})