import React, { Fragment, useCallback, useDeferredValue, useEffect, useState } from 'react'
import { Button, Card, Row, Col } from 'react-bootstrap'
import Wheels from "../../assets/wheel.png";
import Stand from "../../assets/stand.png";
import Diamond from "../../assets/diamond.png";
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { AES, enc } from 'crypto-js';
import { useParams } from 'react-router-dom';
import RazropayServices from "../Axios/RazropayServices"
import useRazorpay from "react-razorpay";
import SpinWheel from './SpinWheel';
import { Blocks, RotatingLines } from 'react-loader-spinner';
import { decode, encode } from 'js-base64';


const Home = () => {

    const [Diamonds, setDiamonds] = useState(0)
    const [Tarrif, setTarifList] = useState([])
    const List = useDeferredValue(Tarrif)
    const [Faint, setFaint] = useState(0)
    const [Platform, setPlatform] = useState("")
    const [CreditPayload, SetCreditPayload] = useState()
    const [Prediction, setPredictions] = useState()
    const [Section, setSection] = useState(true)
    const [loader, setloader] = useState(true)

    var Key = import.meta.env.VITE_URL_RAZORPAYKEYENC

    var user = 0
    var Second = ""

    const { id } = useParams()

    const ENC = (Data) => {
        const cipherText = AES.encrypt(Data, Key);
        return cipherText.toString();
    }

    const DEC = (Data) => {
        const bytes = AES.decrypt(Data, Key)
        const decrypted = bytes.toString(enc.Utf8);
        return decrypted
    }


    const DiamondsFetch = async () => {
        const data = {
            userId: user,
            ids: encode(`${Second}:${user}`)
        }
        const en = ENC(JSON.stringify(data))

        const d = DEC(en)
        // console.log(en)
        console.log(en, d)


        RazropayServices.RazrpayGetDiamond({ startDate: en }).then((data) => {
            console.log(data.data[0])
            setDiamonds(data.data[0])
        })
    }

    useEffect(() => {

        (async () => {

            const dec = decode(id)

            let k = dec.split(",")

            user = k[0]
            Second = k[1]

            console.log(k)

            DiamondsFetch()
            const { data } = await RazropayServices.RazrpayList()
            setTarifList(data)
            setloader(false)
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
    }, [Section])


    const SpinWheels = useCallback(() => {
        if (!Section) {
            return (
                <>
                    {!Section ? (
                        <>
                            <SpinWheel setClose={setSection} datas={Diamonds} prediction={Prediction}
                                user={Faint}
                                CreditPayloads={CreditPayload}
                                fetch={DiamondsFetch} ids={encode(`${Platform}:${Faint}`)} />
                        </>
                    ) : (<></>)}
                </>
            )
        }
    }, [Section])



    // Razropay

    const Razorpay = useRazorpay();
    const handlePayment = useCallback(async (amount, id) => {
        setloader(true)

        let orderid = "";

        console.log(id)

        const prePayload = {
            amount: id,
            userId: user,
            ids: encode(`${Second}:${user}`)
        }
        const encPayload = JSON.stringify(prePayload)

        const FinalPayload = ENC(encPayload)

        const date = FinalPayload

        console.log(prePayload)

        console.log(date)

        const order = await RazropayServices.Razrpay({
            date
        });

        console.log(order.data)
        orderid = order.data.body.orderId


        SetCreditPayload(() => {
            return {
                user,
                orderid: order.data.body.orderId
            }
        })

        console.log(order.data.body.orderId)

        const options = {
            key: `${import.meta.env.VITE_URL_RAZORPAYID}`,
            amount,
            currency: "INR",
            name: "Top Class Entertainment",
            description: "Test Transaction",
            image: "https://i.pinimg.com/originals/54/3d/f6/543df6fa910a635db1f13c41f8c62251.jpg",
            order_id: orderid,
            handler: async (res) => {
                setFaint(user)
                setPlatform(Second)
                const prePayload = {
                    amount: orderid,
                    userId: user,
                    ids: encode(`${Second}:${user}`)
                }

                const prePayloadDiamond = {
                    amount: orderid,
                    userId: user,

                }

                console.log(prePayloadDiamond)
                // f1
                const encPayload = JSON.stringify(prePayload)

                const FinalPayload = ENC(encPayload)

                const date = FinalPayload


                // f2

                const prePayload2 = {
                    amount: orderid,
                    userId: user,
                    ids: encode(`${Second}:${user}`)
                }

                const encPayload2 = JSON.stringify(prePayload2)

                const FinalPayload2 = ENC(encPayload2)

                const date2 = FinalPayload2

                console.log(date2)

                const order = await RazropayServices.RazrpayDiamond({
                    date: date2
                })

                if (order) {

                    setPredictions(order)

                    setSection(false)

                    // setFaint(true)
                    setloader(false)


                }
                console.log(order);

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

    return (
        <Fragment>

            {loader && <div className='loader z-4'>

                <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />

            </div>}



            {
                Section ? (

                    <>
                        <Card className="Cardonly">
                            <Card.Header className='WheelCardHeader'>
                                <Row>
                                    <Col className=''>
                                        <MdOutlineArrowBackIosNew className='Back' />
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Row className='profiles'>
                                    <Col className="  d-flex">
                                        {
                                            Diamonds !== 0 ? (<>
                                                <div>
                                                    <img src={Diamonds.profile_pic} width={"55px"} height={"55px"} className='profileimg' />

                                                </div>
                                                <div className='ml-5'>
                                                    <span className='username text-white'>{Diamonds.name}</span>
                                                    <p className='text-white'>ID:{Diamonds.user_id}</p>
                                                </div>
                                            </>) : (<>
                                                <div>
                                                    <img src={Wheels} width={"55px"} height={"55px"} className='profileimg' />

                                                </div>
                                                <div className='ml-5'>
                                                    <h6 className='username text-white'>""</h6>
                                                    <p className='text-white'>ID:0</p>
                                                </div>
                                            </>)
                                        }

                                    </Col>

                                </Row>
                                <Row className='Wheelimg'>
                                    <img src={Wheels} className='WheelImg' />
                                    <img src={Stand} className='WheelStand' />
                                </Row>

                                <Row className='circle'>


                                </Row>

                                {/* upper Part done medium small pending */}

                                <Row className='Content'>




                                    <Col sm="12" className='FullTariff'>
                                        <Row>
                                            <Col xs={{ offset: 3, span: 8 }} className=''>
                                                <div>
                                                    <p className='text-white dlol'>
                                                        Available Diamonds
                                                    </p>
                                                    <p className='text-white lol'><span><img src={Diamond} width={"20px"} height={"20px"} className='DiamondImglol' /></span>{Number(Diamonds.diamond)}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className='text-white headings'>Available Packs</p>
                                        {
                                            Tarrif.length !== 0 ? (<>{
                                                Tarrif.map((data) => {
                                                    return (
                                                        <Row className='Tariff'>
                                                            <Col className="Tarrifone">
                                                                <Row>
                                                                    <Col>
                                                                        <div className='DiamondsSpace p-1 mt-3'>
                                                                            <img src={Diamond} width={"30px"} height={"30px"} className='DiamondImg' />
                                                                        </div>
                                                                    </Col>
                                                                    <Col>
                                                                        <div className='DiamondsNumber'

                                                                        >
                                                                            <p>{data.diamonds}</p>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col className='Tarrifetwo'>
                                                                <div className='Price'
                                                                    onClick={() => {
                                                                        handlePayment(data.diamonds, data.id)
                                                                    }}
                                                                >
                                                                    <p className='text-center'>₹{data.price}</p>
                                                                </div>

                                                            </Col>
                                                        </Row>
                                                    )
                                                })
                                            }</>) : (<></>)
                                        }
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </>
                ) : (<SpinWheels />)
            }





        </Fragment>
    )
}

export default Home