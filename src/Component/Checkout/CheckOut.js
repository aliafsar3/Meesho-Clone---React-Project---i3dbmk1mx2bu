import React, { useState,useEffect, useContext } from "react";
import { DataAppContext } from "../AppData";
import "../StyleComp/CheckOut.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
import { faCircle} from "@fortawesome/free-solid-svg-icons";
import { faCreditCard} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


const CheckOut = () => {

  //create initial object of form card details
  const initialData = {
    cardname: '',
    cardnumber: '',
    date: '',
    cvv: '',
}
  
  const navigate  = useNavigate();
  const [reselling, setReselling] = useState();
  const [formdata, setFormdata] = useState(initialData);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [showCard, setShowCard] = useState();
  const [showReselling, setShowReselling] = useState(true);
  const [hideselect, sethideselect] = useState(true);
  const [showhideselect, setshowhideselect] = useState();
  const [formerror, setFormerror] = useState({});
  const localContext = useContext(DataAppContext);
  const {appState, setAppState } = localContext;
  const {totalprice,discount, loginStatus, paymentType} = appState;
  
  const finalPrice = (totalprice - discount).toFixed(2);

  //set card details in Formdata
  const updateData = (e) => {
    let tempObj = {};
    tempObj[e.target.id] = e.target.value;
    setFormdata({
        ...formdata, ...tempObj
    });    
}

//Before Render page Check login Status
useEffect(() => {
    setAppState({
      ...appState, showSearch:false,
      showProCart:false, paymentType:"Cash On Delivery"
    });
  if (!loginStatus) {
      navigate('/login');
  }
}, []);


//Save card information on context api
const payFn = () => {
  const ret = validationFn();
  if(paymentType === "Cash On Delivery"){    
    navigate('/summary')
  }else if(ret){
    setPaymentStatus(true);
    setAppState({
      ...appState, ...formdata
    });    
      navigate('/summary')
  }
  }


//validate card Details
const validationFn = () => {

  let errorObj = {};

  if (formdata.cardname === '') {
      errorObj.cardname = 'Card Number is empty'
  }
  if (formdata.cardnumber === '') {
      errorObj.cardnumber = 'Card Number is empty'
  }
  if (formdata.date === '') {
      errorObj.date = 'Date is empty'
  }
  if (formdata.cvv === '') {
      errorObj.cvv = 'CVV is empty'
  }

  setFormerror(errorObj);

  if (Object.keys(errorObj).length > 0) {
      return false
  }
  else {
      return true
  }

}

//Show Hide card Container and select payment type
const selectPayment=(paymethods)=>{
  if(paymethods ==="COD"){
    setShowCard(false);
    setShowReselling(true);
    sethideselect(true)
    setshowhideselect(false)
    setAppState({
      ...appState,paymentType:"Cash On Delivery"
    })
    
  }else if(paymethods === "CardPayment"){
    setShowCard(true);
    setShowReselling(false);
    sethideselect(false)
    setshowhideselect(true)
    setAppState({
      ...appState,paymentType:"Debit/Credit Card Payment"
    })
  }
}

  return (
    <div className="checkout_page">
      <div className="checkoutmaincont">
        <div className="paymentContainer">
          
           { true && <div> <div className="paymentmethod">
            <span className="selcectmethod">Select Payment Method</span>
            <span className="selcectmethod_payment">
              100% SAFE
              <br />
              PAYMENTS
            </span>
          </div>
          <div className="payincash">
            <div>PAY IN CASH</div>
            <div className="horizontalline"></div>
          </div>
          <div className="paymentmethod">
            <div>
              <div className="formcontainer selectopt">
                  <span className="iconspancontainer crcleicon" onClick={()=>selectPayment("COD")}>
                  {hideselect  && <FontAwesomeIcon icon={faCircle}  />}
                  </span>
                  <span onClick={()=>selectPayment("COD")}>Cash On Delivery</span>
              </div>
              <div className="formcontainer ">
                  <span className="iconspancontainer crcleicon" onClick={()=>selectPayment("CardPayment")}>
                  {showhideselect  && <FontAwesomeIcon icon={faCircle}  />}
                    </span>
                  <span onClick={()=>selectPayment("CardPayment")}>Pay with Credit/Debit Card</span>
              </div>
            </div>
          </div>
          { showCard && <div className="paymentbox">
                        <div className="cardPayCon">
                          <div className="paymentcardheader">
                            <h1>Secure Payment Info</h1>
                            <FontAwesomeIcon icon={faCreditCard} className="cardicon" />
                            </div>
                              <form>
                            <div className="inputContainers">
                            <input className="inputbox " type="text" placeholder="Name on card" id="cardname" onChange={updateData} value={formdata.cardname} />
                            <div className="errormessg">{formerror.cardname}</div>

                            <input className="inputbox" type="number" placeholder="Card Number"  id="cardnumber" onChange={updateData} value={formdata.cardnumber} />
                            <div className="errormessg ">{formerror.cardnumber}</div>

                            <input className="inputbox" type="date" placeholder="Expiry Date" id="date" onChange={updateData} value={formdata.date} />
                            <div className="errormessg ">{formerror.date}</div>

                            <input className="inputbox" type="number" placeholder="CVV" id="cvv"  onChange={updateData} value={formdata.cvv} />
                            <div className="errormessg ">{formerror.cvv}</div>
                            </div>
                            </form>
                        </div>
                    </div>}
         {showReselling && <div className="">
            <div className="reselling_order">
              <span>
                <h2>Reselling the Order?</h2>
              </span>
              <span className="clickon">
                <p>click on 'Yes' to add Final Price</p>
              </span>
            </div>
            <div>
              <span className="resellingbtn ">
                <button onClick={() => setReselling(false)}>No</button>
                <button onClick={() => setReselling(true)}>Yes</button>
              </span>
              <span></span>
            </div>
          </div>}
          {reselling && (
            <div className="cashtobeContainer">
              <div className="cashtobecollected">Cash to Collected</div>
              <div className="orderTotalMarin">
                <input
                  placeholder="Order Total (₹1053) + Your Margin"
                  className="inputboxcontnr"
                />
              </div>
              <div className="marginbox">Your Margin: ₹0</div>
            </div>
          )}</div>}

        </div>
        <div>
          <div className="prcedetailpage">
            <div className="pricesubcontainer">
              <div className="pcontainer">
                <div className="pricedetailcontainerbox">Price Details</div>
                <div className="priceProductContainer">
                  <span className="totalprdprice">Total Product Price</span>
                  <span className="pricetagfont">+₹{totalprice}</span>
                </div>
                <div className="priceProductContainer ">
                  <span className="totldiscount">Total Discounts</span>
                  <span className="totldiscountprice">-₹{discount}</span>
                </div>
                <div className="hrlinepricecontainer"></div>
                <div className="priceProductContainer">
                  <span className="orderttl">Order Total</span>
                  <span className="pricetagfont">₹{finalPrice}</span>
                </div>
                <div className="discountcontainer">
                  <span>
                    <FontAwesomeIcon icon={faPercent} />
                  </span>
                  <span className="pricetagfont">
                    
                    Yah! Your total discount is ₹{discount}
                  </span>
                </div>
              </div>
              <div className="moneydeduct">
                <div className="moneydeduct anymoney">
                  clicking on 'Continue' will not deduct any money
                </div>
                <div className="placedordercontainer">
                    <button onClick={payFn}>Placed order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
