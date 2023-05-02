import React, { Fragment, useDeferredValue, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import "./Home.css"
import Diamondeimg from "../../assets/diamond-01.png"
import { RazropayServices } from '../Axios/RazropayServices'
import useRazorpay from "react-razorpay";
import WheelComponent from 'react-wheel-of-prizes';
import { gsap } from 'gsap';
import { AES, enc } from 'crypto-js';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const OldHome = () => {
    const [Diamonds, setDiamonds] = useState(0)
    const [Tarrif, setTarifList] = useState([])
    const List = useDeferredValue(Tarrif)
    const [Faint, setFaint] = useState(false)
    const [Platform, setPlatform] = useState(false)
    const [CreditPayload, SetCreditPayload] = useState()

    var Key = ""
    var user = 0

    const { id } = useParams()

    const ENC = (Data, Key) => {
        const cipherText = AES.encrypt(Data, Key);
        return cipherText.toString()
    }

    const DEC = (Data, Key) => {
        const bytes = AES.decrypt(Data, Key)
        const decrypted = bytes.toString(enc.Utf8);
        return decrypted
    }


    const DiamondsFetch = async () => {
        RazropayServices.RazrpayGetDiamond({ startDate: id }).then((data) => {
            console.log(data.data[0].diamond)
            setDiamonds(data.data[0].diamond)
        })
    }

    useEffect(() => {

        (async () => {
            let k = id.split("₹")
            Key = k[1]

            const h = DEC(id, k[1])

            user = h

            console.log(h)

            DiamondsFetch()
            const { data } = await RazropayServices.RazrpayList()
            setTarifList(data)
            console.log(data)
            let os = navigator.userAgent;
            let finalOs = null;
            if (os.search('Windows') !== -1) {
                finalOs = "Windows";
            }
            else if (os.search('Mac') !== -1) {
                finalOs = "MacOS";
            }
            else if (os.search('X11') !== -1 && !(os.search('Linux') !== -1)) {
                finalOs = "UNIX";
            }
            else if (os.search('Linux') !== -1 && os.search('X11') !== -1) {
                finalOs = "Linux"
            }
            else {

                if (('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0)) {
                    setPlatform(true)
                } else {

                }
            }
            console.log(finalOs)
        })()
    }, [])



    // Razropay

    const Razorpay = useRazorpay();
    const handlePayment = useCallback(async (amount, id) => {

        let orderid = "";

        console.log(id)

        const prePayload = {
            amount: id,
            userId: user
        }
        const encPayload = JSON.stringify(prePayload)

        const FinalPayload = ENC(encPayload, Key)


        const date = FinalPayload + "₹" + Key

        console.log(date)

        console.log(date.split("₹"))

        const order = await RazropayServices.Razrpay({
            date
        });

        console.log(order.data)
        orderid = order.data.body.orderId

        console.log(order.data.body.orderId)

        const options = {
            key: `${import.meta.env.VITE_URL_RAZORPAYID}`,
            amount,
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://i.pinimg.com/originals/54/3d/f6/543df6fa910a635db1f13c41f8c62251.jpg",
            order_id: orderid,
            handler: async (res) => {
                const prePayload = {
                    amount: orderid,
                    userId: user
                }

                const prePayloadDiamond = {
                    amount: orderid,
                    userId: user,

                }

                console.log(prePayloadDiamond)
                // f1
                const encPayload = JSON.stringify(prePayload)

                const FinalPayload = ENC(encPayload, Key)

                const date = FinalPayload + "₹" + Key


                // f2
                const encPayload2 = JSON.stringify(prePayloadDiamond)

                const FinalPayload2 = ENC(encPayload2, Key)

                const date2 = FinalPayload2 + "₹" + Key


                console.log(date2)

                const order = await RazropayServices.RazrpayDiamond({
                    date
                })
                console.log(order);

                SetCreditPayload(prePayloadDiamond)


                setFaint(true)
            },
            prefill: {
                name: "Piyush Garg",
                email: "youremail@example.com",
                contact: "9999999999",
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzpay = new Razorpay(options);
        rzpay.open();
    }, [Razorpay]);

    //Spin Wheel

    const SpinWheel = useCallback(() => {

        (() => {
            gsap.from('.squarem', { rotate: 360, duration: 2, scale: 3 })

        })()
        const segments = [
            "80",
            '70',
            '60',
            '50',
            '20',
        ]
        const segColors = [
            '#EE4040',
            '#F0CF50',
            '#815CD1',
            '#3DA5E0',
            '#34A24F',
        ]
        const onFinished = async (winner) => {
            console.log(winner)
            gsap.from('.squarem', { scale: 2 })


            const payload = CreditPayload



            const d = {
                ...payload,
                diamond: parseInt(winner)
            }

            console.log(d)

            const encPayload2 = JSON.stringify(d)

            const FinalPayload2 = ENC(encPayload2, Key)

            const date2 = FinalPayload2 + "₹" + Key


            // console.log(date2)

            const { data } = await RazropayServices.RazrpayDiamondCredit({ startDate: date2 })

            console.log(data)
            if (data) {
                DiamondsFetch()
            }
            setTimeout(() => {

                Swal.fire({
                    icon: 'success',
                    title: ` You Won ${winner}`
                })

                setFaint(false)
            }, 1000);

        }
        if (Faint) {
            return (
                <>
                    {Faint ? (
                        <>
                            <div
                                className="justify-center rounded-3xl items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                            >
                                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                    {/*content*/}
                                    <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                        {/*header*/}
                                        {/*body*/}
                                        <div className='modalspin squarem'>
                                            <WheelComponent
                                                segments={segments}
                                                segColors={segColors}
                                                winningSegment={""}
                                                onFinished={(winner) => onFinished(winner)}
                                                primaryColor='black'
                                                contrastColor='white'
                                                buttonText='Spin'
                                                isOnlyOnce={true}
                                                size={180}
                                                upDuration={100}
                                                downDuration={1000}
                                                fontFamily='Arial'
                                            />
                                        </div>

                                        {/*footer*/}

                                    </div>
                                </div>
                            </div>
                            <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
                        </>
                    ) : null}
                </>
            )
        }
    }, [Faint])


    return (
        <Fragment>
            {
                Platform ? (<>
                    <div class="grid grid-cols-1 sm:grid-cols-2 fullcard min-h-screen">
                        {/* First Card */}
                        <div class="firstscreen grid grid-cols-1 sm:grid-cols-2">
                            <div className='firstalign'>
                                <div className='flex flex-col text-xl mb-20 text-center text-white mr-5'>
                                    <div className='text-2xl tex fonttext'>
                                        CURRENT BALANCE
                                    </div>
                                    <div className='mt-2'>
                                        <h3>
                                            <img src={Diamondeimg} width={"20px"} className='Diamondicons' />
                                            <p className='text-sm tex'>{Diamonds}</p>
                                        </h3>

                                    </div>

                                </div>
                            </div>
                            <div className=''>
                            </div>
                        </div>


                        {/* second Card */}
                        <div class="">
                            <div className='m  '>
                                {List.length !== 0 ? List.map((data) => {

                                    return (
                                        <div className='border  bg-gray-300 mt-8 rounded-md text-center'
                                            onClick={() => {
                                                handlePayment(data.diamonds * 100, data.id)
                                            }}
                                        >
                                            <div className='grid  grid-cols-3'>
                                                <div className='mt-2  ml-3 mb-2 pr-1'>
                                                    <div className=' border  border-black pl-5 pt-3 rounded-3xl h-full ml-6 mb-2 '>
                                                        <img className=' rounded-md l c' src={Diamondeimg} width={"20px"} alt="DIAMOND" />
                                                    </div>
                                                </div>
                                                <div className='mt-5 tex'>
                                                    {data.diamonds}

                                                </div>
                                                <div className='price tex rounded-md '>
                                                    <p className='mt-3'>
                                                        ₹{data.price}<br /> <p>BUY</p>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })

                                    : ""}

                            </div>
                        </div>
                    </div>
                    <SpinWheel />

                </>) : (<></>)
            }


        </Fragment>
    )
}

export default OldHome