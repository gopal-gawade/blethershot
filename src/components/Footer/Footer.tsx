import React from "react";

export default function Footer() {
    return (
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
            <div>
                <span className="text-xl font-bold">
                    Blethershot
                </span>
            </div>

            <div>
                <span>
                    ©2025 Blethershot. All rights reserved.
                </span>
            </div>
        </div>
    );
}
