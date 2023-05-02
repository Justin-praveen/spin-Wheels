// import { gsap } from 'gsap';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import "./Wheel.css";
import wheelsimg from "../assets/wheel.png"
import pin from "../assets/pin.png";
import stand from "../assets/stand.png";
import diamond from "../assets/diamond.png"
import { Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import RazropayServices from './Axios/RazropayServices';
import { AES } from 'crypto-js';
import { json } from 'react-router-dom';

const Wheel = ({ close, datas, prediction, CreditPayloads, pay }) => {

    const [trigger, settrigger] = useState(false)

    const [segments, setsegments] = useState([])
    const [posiblitydata, setposiblitydata] = useState()

    useEffect(() => {
        (async () => {
            const { data } = await RazropayServices.RazrpayDiamondList()
            setsegments(data)
            console.log(prediction)
            setposiblitydata(prediction.data.body)
            console.log(pay)
        })()
    }, [])



    const ENC = (Data, Key) => {
        const cipherText = AES.encrypt(Data, Key);
        return cipherText.toString()
    }


    const possible = [180, 135, 90, 45, 360, 315, 270, 225]

    const h = useRef()

    let number = Math.ceil(Math.random() * 1000);

    return (
        <Fragment>
            <div className="f">
                <div className='spinz'>
                    <button id="spin"
                        onClick={() => {
                            if (!trigger) {
                                settrigger(true)
                                h.current.style.transform = "rotate(" + (360 + (possible[posiblitydata.index])) + "deg)";
                                number += Math.ceil(Math.random() * 1000);
                                setTimeout(() => {
                                    Swal.fire({
                                        title: `${posiblitydata.data === 0 ? 'Sorry...!' : 'congratulation...!'}`,
                                        text: ` ${posiblitydata.data === 0 ? `Better Luck Next Time` : `You Won ${posiblitydata.data} Diamonds as a reward`}`,
                                        showClass: {
                                            popup: 'animate__animated animate__fadeInDown'
                                        },
                                        hideClass: {
                                            popup: 'animate__animated animate__fadeOutUp'
                                        },
                                        background: "#0E39C6",
                                        color: "white",
                                        blur: 20,
                                        confirmButtonColor: "#03A116",
                                    }).then(async () => {


                                        console.log(CreditPayloads)

                                        const datas = {
                                            userId: CreditPayloads.user,
                                            amount: CreditPayloads.orderid,
                                            diamond: posiblitydata.rewardId,
                                            ids: pay
                                        }

                                        const json2string = JSON.stringify(datas)

                                        console.log(datas, json2string)

                                        const EN = ENC(json2string, import.meta.env.VITE_URL_RAZORPAYKEYENC)
                                        console.log(EN)



                                        const { data } = await RazropayServices.RazrpayDiamondCredit({
                                            startDate: EN
                                        })
                                        console.log(data)
                                        close(true)
                                    })

                                }, 5000)
                            }
                        }}
                    >{trigger ? <div className='jj'><img src={datas.profile_pic} className='Spinimgs' /></div> : "spin"}</button>
                </div>

                <div className='i'>
                    <img src={pin} className='Pin' />
                    {/* <img src={stand} className={"Stand"} /> */}

                    <img className='im'
                        src={wheelsimg}
                    />
                </div>

                <div className="container" ref={h}>

                    <div className="one">
                        {
                            segments.length !== 0 && parseInt(segments[0]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <p className='fon'>
                            {segments.length !== 0 ? segments[0] : "0"}
                        </p>

                    </div>
                    <div className="two">
                        {
                            segments.length !== 0 && parseInt(segments[1]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <p className='fon'>
                            {segments.length !== 0 ? segments[1] : "0"}
                        </p>
                    </div>
                    <div className="three">
                        {
                            segments.length !== 0 && parseInt(segments[2]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <p className='fon'>
                            {segments.length !== 0 ? segments[2] : "0"}
                        </p>
                    </div>
                    <div className="four">
                        {
                            segments.length !== 0 && parseInt(segments[3]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <p className='fon'>
                            {segments.length !== 0 ? segments[3] : "0"}
                        </p>
                    </div>
                    <div className="five">
                        {
                            segments.length !== 0 && parseInt(segments[4]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <p className='fon'>
                            {segments.length !== 0 ? segments[4] : "0"}
                        </p>
                    </div>
                    <div className="six">
                        {
                            segments.length !== 0 && parseInt(segments[5]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <p className='fon'>
                            {segments.length !== 0 ? segments[5] : "0"}
                        </p>
                    </div>
                    <div className="seven">
                        {
                            segments.length !== 0 && parseInt(segments[6]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <p className='fon'>
                            {segments.length !== 0 ? segments[6] : "0"}
                        </p>
                    </div>
                    <div className="eight">
                        {
                            segments.length !== 0 && parseInt(segments[7]) ?
                                <span>
                                    <img src={diamond}
                                        width={"15px"}
                                        height={"15px"}
                                    />
                                </span> : ""
                        }

                        <h6 className='fon'>
                            {segments.length !== 0 ? segments[7] : "0"}
                        </h6>
                    </div>
                </div>

            </div>
        </Fragment>

    )
}

export default Wheel