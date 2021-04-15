import React from "react";
import "./core/style/home.css"
//Packages-----------------
import { Container } from "react-bootstrap";
//Images-----------------
// import dostiKatta from "./dostiKatta.png";

const Page404 = () => {
    return (
        <Container fluid className="home_page" style={{minHeight: "100vh"}}>
            <div className="load404">
                {/* <img src={dostiKatta} alt="loading..." /> */}
            </div>
            <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginTop: "20px"}}>
                <h1 style={{fontSize: "10em", fontFamily: "'Lilita One', cursive"}}>404</h1>
                <h2>Page Not Found</h2>
            </div>
        </Container>
    )
}

export default Page404;