const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let currentExpression = '';
let displayValue = '';

app.get('/', (req, res) => {
    res.render('calculator', { displayValue });
});

app.post('/calculate', (req, res) => {
    const operation = req.body.operation;
    
    if (operation === 'C') {
        currentExpression = '';
    } 
    else if (operation === 'DEL') {
        currentExpression = currentExpression.slice(0, -1);
    } 
    else if (operation === '=') {
        try {
            currentExpression = eval(currentExpression).toString();
        } 
        catch (error) {
            currentExpression = 'Error';
        }
    } 
    else {
        currentExpression += operation;
    }
    
    // Handle special cases for PI and E(Makes PI and E to its Actual values)
    currentExpression = currentExpression
        .replace(/Math\.PI/g, Math.PI)
        .replace(/Math\.E/g, Math.E);

    // Handle percentage(Makes Percentage to its actual value)
    currentExpression = currentExpression.replace(/(\d+\.?\d*)([+\-*/])(\d+\.?\d*)%/g, (match, num1, op, num2) => {
            const percentValue = (parseFloat(num1) * parseFloat(num2)) / 100;
            return `${num1}${op}${percentValue}`;
        });
    
    displayValue = currentExpression;
    
    // Reset after error(It's Only works for Server Side)
    if (currentExpression === 'Error') {
        setTimeout(() => {
            currentExpression = '';
            displayValue = '';
        }, 1000);
    }
    
    res.render('calculator', { displayValue });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});