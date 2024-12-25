"use client";
import React, { useState, useEffect } from "react";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

const ScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 600) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    showButton && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-10 right-10 p-4 bg-emerald-500 text-white rounded-full shadow-black-300 shadow-md hover:bg-emerald-600 opacity-85 hover:opacity-95 transition-colors"
        aria-label="Scroll to top"
      >
        <VerticalAlignTopOutlined
          className="text-2xl"
          aria-label="Scroll to top"
        />
      </button>
    )
  );
};

export default ScrollToTop;
