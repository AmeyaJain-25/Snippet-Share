import React from "react";
import "./core/style/home.css"
//Packages-----------------
import { Container } from "react-bootstrap";
//Images-----------------
import logoSnippetShare from "./assets/logoSnippetShare.png";

const Page404 = () => {
    return (
        <Container fluid className="home_page" style={{minHeight: "100vh"}}>
            <div className="load404">
                <img src={logoSnippetShare} alt="loading..." width="100%"/>
            </div>
            <div style={{display: "flex", alignItems: "center", flexDirection: "column", marginTop: "20px"}}>
                <h1 style={{fontSize: "10em", fontFamily: "'Lilita One', cursive"}}>404</h1>
                <h2>Page Not Found</h2>
            </div>
        </Container>
    )
}

export default Page404;