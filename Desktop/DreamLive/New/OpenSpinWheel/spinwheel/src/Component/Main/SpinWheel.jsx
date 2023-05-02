import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import Wheel from '../Wheel'
import Diamond from "../../assets/diamond.png";
import RazropayServices from '../Axios/RazropayServices';
import { AES } from 'crypto-js';
import { gsap } from 'gsap';


const SpinWheel = ({ setClose, datas, prediction, CreditPayloads, user, ids, fetch }) => {


    const [diamondsCredit, setdiamondsCredit] = useState(datas.diamond)

    var Key = import.meta.env.VITE_URL_RAZORPAYKEYENC

    const DiamondNumber = useRef()

    var game = { score: 0 }


    useEffect(() => {
        console.log(user)
        DiamondsFetch()
    }, [])


    const ENC = (Data) => {
        const cipherText = AES.encrypt(Data, Key);
        return cipherText.toString()
    }



    const DiamondsFetch = async () => {
        const data = {
            userId: user,
            ids
        }

        console.log(data, ids, user
        )

        const en = ENC(JSON.stringify(data))

        // const d = DEC(en)
        // console.log(en)
        // console.log(en, d)



        let DiamondsNum;

        RazropayServices.RazrpayGetDiamond({ startDate: en }).then((data) => {

            console.log(data.data[0])

            DiamondsNum = data.data[0].diamond

            // setdiamondsCredit(data.data[0].diamond)
        })

        gsap.to(game, 1, { score: "+=20", roundProps: "score", onUpdate: updateHandler, ease: Linear.easeNone });


        function updateHandler() {
            setdiamondsCredit(DiamondsNum)
        }
    }


    console.log(datas)
    return (
        <Fragment>
            <Card className='spinFullCard'>
                <Card.Header>
                    <h1 className='text-center text-white SpinWheelHead'>Spin&Win</h1>
                </Card.Header>
                <Card.Body>

                    <Wheel close={setClose} datas={datas} prediction={prediction} CreditPayloads={CreditPayloads} pay={ids} />
                </Card.Body>
                <Card.Footer >
                    <Row className='mt-5'>
                        <Col xs={{ offset: 3, span: 8 }} className=''>
                            <div>
                                <p className='text-white dlol'>
                                    Available Diamonds
                                </p>
                                <p className='text-white lol'><span><img src={Diamond} width={"20px"} height={"20px"} className='DiamondImglol' /></span><span ref={DiamondNumber}>{diamondsCredit}</span></p>
                            </div>
                        </Col>
                    </Row>

                    <div className='SpinFooter'>

                        <h2 className='text-center spinfootertext'>
                            You will be lucky in your Purchases Just Spin and win Diamonds
                        </h2>
                        <p className='text-left spinfootertexttwo'>
                            Note : Your Winning diamond will credit instantly in your wallet , you can spin more for each time you purchase , Terms and conditions applied reward diamond subject to change by the company (Dream Live)
                        </p>
                    </div>
                </Card.Footer>
            </Card>

        </Fragment>
    )
}

export default SpinWheel