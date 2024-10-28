const { createCanvas } = require('canvas');

function generateCaptchaText(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}

async function generateCaptchaImage(text) {
    const width = 275;
    const height = 125;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#232323';
    ctx.fillRect(0, 0, width, height);

    // Text with random rotation, size, and spacing
    const xStart = 20;
    let x = xStart;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const fontSize = Math.floor(Math.random() * 10) + 30; // Random font size between 30 and 40
        const rotation = (Math.random() - 0.5) * 0.4; // Random rotation between -0.2 and 0.2 radians
        const y = Math.floor(Math.random() * 20) + 40; // Random y position between 40 and 60

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillText(char, 0, 0);
        ctx.restore();

        x += fontSize + Math.floor(Math.random() * 5); // Random spacing between characters
    }

    // Lines
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(0,0,0,${Math.random()})`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.stroke();
    }

    // Decoy characters
    const decoyChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
        const fontSize = Math.floor(Math.random() * 20) + 10; // Random font size between 10 and 30
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = `rgba(0,0,0,${Math.random()})`;
        ctx.fillText(decoyChars.charAt(Math.floor(Math.random() * decoyChars.length)), Math.random() * width, Math.random() * height);
    }

    return canvas;
}

module.exports = { generateCaptchaText, generateCaptchaImage };
