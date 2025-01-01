import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./mainPage.css";

function MainScreen() {
    const [startY, setStartY] = useState(null);
    const navigate = useNavigate();

    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        if (startY !== null) {
            const currentY = e.touches[0].clientY;
            if (startY - currentY > 50) {
                triggerAnimation();
            }
        }
    };

    const handleMouseDown = (e) => {
        setStartY(e.clientY);
    };

    const handleMouseMove = (e) => {
        if (startY !== null) {
            const currentY = e.clientY;
            if (startY - currentY > 50) {
                triggerAnimation();
            }
        }
    };

    const handleMouseUp = () => {
        setStartY(null);
    };

    const triggerAnimation = () => {
        const container = document.querySelector(".mainContainer");
        if (container) {
            container.classList.add("slideUp");
            setTimeout(() => {
                navigate("/loginP"); // Navigate to the next page
            }, 500); // Wait for the animation to finish
        }
    };

    return (
        <div
            className="mainContainer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="topContainer">
                <h1>Kitchen</h1>
                <h1>Canvas</h1>
            </div>

            <div className="bottomContainer">
                <button onClick={triggerAnimation}>
                    <b>Swipe Up</b>
                </button>
            </div>
        </div>
    );
}

export default MainScreen;