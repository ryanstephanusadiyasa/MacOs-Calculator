/**
 * LOGIC FLOW
 * 
 * 1. INITIALIZATION FLOW
 * DOM Ready → Constructor → Get Display Element → Initialize State → Setup Event Listeners
 * - Waits for DOM to load, creates Calculator instance
 * - Finds display element, throws error if missing
 * - Sets initial state: currentValue='0', previousValue=null, operator=null
 * 
 * 2. USER INPUT FLOW
 * Button Clicks:
 * Button Click → Extract data attributes → Clear active operator styling → Route by type → Update display
 * 
 * Keyboard Input:
 * Key Press → Check key type → Map to function → Update display
 * 
 * 3. NUMBER INPUT LOGIC
 * inputNumber() → Check waitingForNewValue flag
 * ├─ True: Start new number (replace current)
 * └─ False: Append digit (or replace leading zero)
 * 
 * 4. OPERATOR INPUT LOGIC
 * inputOperator() → Check if previousValue exists
 * ├─ No previous: Store current as previous
 * └─ Has previous + operator + not waiting: Calculate first, then store
 * → Set waitingForNewValue = true
 * → Store new operator
 * 
 * 5. CALCULATION CHAIN LOGIC
 * For operations like 5 + 3 × 2:
 * 1. 5 → currentValue = "5"
 * 2. + → previousValue = 5, operator = "+", waiting = true
 * 3. 3 → currentValue = "3", waiting = false  
 * 4. × → Calculate 5+3=8, currentValue = "8", previousValue = 8, operator = "×"
 * 5. 2 → currentValue = "2"
 * 6. = → Calculate 8×2=16, reset state
 * 
 * 6. DISPLAY UPDATE FLOW
 * updateDisplay() → Format number
 * ├─ Length > 9: Use scientific notation
 * ├─ Long decimal: Limit precision, remove trailing zeros
 * └─ Adjust font size based on length
 * → Update DOM
 * 
 * 7. STATE MANAGEMENT
 * The calculator maintains state through:
 * - currentValue: What's shown on display
 * - previousValue: Stored number for calculations  
 * - operator: Current math operation
 * - waitingForNewValue: Controls whether next input starts fresh number
 * 
 * KEY LOGIC PATTERNS
 * 1. Chain calculations - Each operator triggers calculation of previous operation
 * 2. State flags - waitingForNewValue controls input behavior
 * 3. UI feedback - Active operator highlighting with state tracking
 * 4. Error prevention - Division by zero returns 0
 * 5. Format handling - Scientific notation and decimal precision for display
 * 
 * The flow ensures smooth chaining of operations while maintaining calculator-like behavior 
 * where each operator press calculates the previous operation before setting up the next one.
 */

// Simple calculator without complex dependencies

/**
 * Main Calculator class implementing a full-featured calculator with error handling,
 * accessibility features, and comprehensive input validation
 * 
 * @example
 * ```typescript
 * // Initialize calculator when DOM is ready
 * const calculator = new Calculator();
 * ```
 */
export class Calculator {
    public display: HTMLElement;
    public currentValue: string;
    public previousValue: number | null;
    public operator: string | null;
    public waitingForNewValue: boolean;
    public activeOperatorBtn: HTMLButtonElement | null;
    public hasError: boolean;
    
    /**
     * Creates a Calculator instance
     * 
     * Initializes calculator state, validates DOM elements, and sets up event listeners.
     * Throws an error if required DOM elements are not found.
     * 
     * @throws {CalculatorError} When display element is not found in DOM
     * 
     * @example
     * ```typescript
     * try {
     *   const calculator = new Calculator();
     * } catch (error) {
     *   console.error('Failed to initialize calculator:', error.message);
     * }
     * ```
     */
    constructor() {
        try {
            // Get and validate display element
            const displayElement = document.getElementById('display');
            if (!displayElement) {
                throw new Error('Display element not found');
            }
            this.display = displayElement;

            // Initialize calculator state to default values
            this.currentValue = '0';            // Start with zero displayed
            this.previousValue = null;          // No previous calculation
            this.operator = null;               // No operator selected
            this.waitingForNewValue = false;    // Not waiting for new input
            this.activeOperatorBtn = null;      // No operator button highlighted
            this.hasError = false;              // No error state

            // Set up event listeners for user interaction
            this.initializeEventListeners();
            
            // Initialize accessibility
            this.updateDisplayAccessibility();
            
        } catch (error) {
            console.error('Calculator initialization error:', error);
            throw error;
        }
    }

    /**
     * Initializes event listeners for button clicks and keyboard input
     * 
     * Sets up event delegation for calculator buttons and global keyboard event handling.
     * Uses event delegation for performance and to handle dynamically created elements.
     * 
     * @private
     * 
     * @example
     * ```typescript
     * // Automatically called during constructor
     * this.initializeEventListeners();
     * ```
     */
    private initializeEventListeners(): void {
        try {
            // Add click listeners to all calculator buttons using event delegation
            const buttonContainer = document.querySelector('.button-grid');
            if (!buttonContainer) {
                throw new Error('Button container not found');
            }
            
            buttonContainer.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('btn')) {
                    this.handleButtonClick(e);
                }
            });

            // Add keyboard listener for keyboard shortcuts
            document.addEventListener('keydown', (e) => this.handleKeyPress(e));

            // Add focus management for accessibility
            document.addEventListener('focusin', this.handleFocusIn.bind(this));
            
        } catch (error) {
            console.error('Failed to initialize event listeners:', error);
            throw error;
        }
    }

    /**
     * Handles button click events and routes them to appropriate calculator functions
     * 
     * Extracts button data attributes, validates input, clears previous operator state,
     * and routes the action to the appropriate handler method.
     * 
     * @param event - The click event from a calculator button
     * 
     * @private
     * 
     * @example
     * ```typescript
     * // Automatically called when buttons are clicked
     * button.addEventListener('click', this.handleButtonClick.bind(this));
     * ```
     */
    private handleButtonClick(event: Event): void {
        try {
            console.log('Button clicked!', event.target); // Debug log
            
            if (this.hasError) return; // Ignore input during error display

            const btn = event.target as HTMLButtonElement;
            const type = btn.dataset.type;
            const value = btn.dataset.value;

            console.log('Button data:', { type, value }); // Debug log

            // Basic validation
            if (!type) {
                console.warn('Button missing type attribute');
                return;
            }

            // Clear any previously active operator button styling
            this.clearActiveOperator();

            // Route to appropriate handler based on button type
            switch (type) {
                case 'number':
                    this.inputNumber(value || '');
                    break;
                case 'operator':
                    this.inputOperator(value || '');
                    btn.classList.add('active'); // Highlight active operator
                    this.activeOperatorBtn = btn;
                    break;
                case 'equals':
                    this.calculate();
                    break;
                case 'decimal':
                    this.inputDecimal();
                    break;
                case 'clear':
                    this.clear();
                    break;
                case 'negate':
                    this.negate();
                    break;
                case 'percent':
                    this.percent();
                    break;
                default:
                    console.warn('Unknown button type:', type);
                    return;
            }

            // Update display after any operation
            console.log('About to update display. Current value:', this.currentValue); // Debug log
            this.updateDisplay();
            this.updateDisplayAccessibility();

        } catch (error) {
            console.error('Button click error:', error);
            this.showError('Error');
        }
    }


    /**
     * Handles keyboard input events and maps them to calculator functions
     * 
     * Provides comprehensive keyboard support including number keys, operators,
     * and special functions. Validates input and provides the same functionality
     * as button clicks.
     * 
     * @param event - The keyboard event
     * 
     * @private
     * 
     * @example
     * ```typescript
     * // Automatically called on keydown events
     * document.addEventListener('keydown', this.handleKeyPress.bind(this));
     * ```
     */
    private handleKeyPress(event: KeyboardEvent): void {
        try {
            if (this.hasError) return; // Ignore input during error display

            const key = event.key;
            let handled = false;

            // Handle number keys (0-9)
            if (key >= '0' && key <= '9') {
                this.inputNumber(key);
                handled = true;
            }
            // Handle operator keys (+, -, *, /)
            else if (['+', '-', '*', '/'].includes(key)) {
                this.inputOperator(key);
                handled = true;
            }
            // Handle equals key (Enter or =)
            else if (key === 'Enter' || key === '=') {
                event.preventDefault(); // Prevent form submission
                this.calculate();
                handled = true;
            }
            // Handle decimal point
            else if (key === '.') {
                this.inputDecimal();
                handled = true;
            }
            // Handle clear keys (Escape, c, C)
            else if (key === 'Escape' || key.toLowerCase() === 'c') {
                this.clear();
                handled = true;
            }
            // Handle percent key
            else if (key === '%') {
                this.percent();
                handled = true;
            }
            // Handle backspace for single digit deletion
            else if (key === 'Backspace') {
                this.backspace();
                handled = true;
            }

            if (handled) {
                // Update display after any keyboard operation
                this.updateDisplay();
                this.updateDisplayAccessibility();
            }

        } catch (error) {
            console.error('Keyboard error:', error);
            this.showError('Error');
        }
    }

    /**
     * Handles numeric input and builds multi-digit numbers
     * 
     * Manages number input state, handles leading zeros, and validates input length.
     * Either starts a new number (after operators/equals) or appends to current number.
     * 
     * @param num - The digit to input (0-9)
     * 
     * @example
     * ```typescript
     * calculator.inputNumber('5'); // Displays "5"
     * calculator.inputNumber('7'); // Displays "57" 
     * ```
     */
    private inputNumber(num: string): void {
        if (this.waitingForNewValue) {
            // Start a new number after operator or equals
            this.currentValue = num;
            this.waitingForNewValue = false;
        } else {
            // Append digit to current number (replace leading zero)
            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }
    }

    /**
     * Handles mathematical operator input and manages calculation chaining
     * 
     * Stores current value, performs pending calculations if exists, and sets up
     * for the next number input. Implements proper calculator chaining behavior.
     * 
     * @param nextOperator - The operator to apply (+, -, *, /)
     * 
     * @example
     * ```typescript
     * calculator.inputNumber('5');
     * calculator.inputOperator('+');  // Sets up addition
     * calculator.inputNumber('3');
     * calculator.inputOperator('*');  // Calculates 5+3=8, then sets up multiplication
     * ```
     */
    private inputOperator(nextOperator: string): void {
        const inputValue = parseFloat(this.currentValue);

        if (this.previousValue === null) {
            // First operator - store current value as previous
            this.previousValue = inputValue;
        } else if (this.operator && !this.waitingForNewValue) {
            // Chain calculation - calculate with existing operator first
            try {
                const result = this.performCalculation();
                this.currentValue = String(result);
                this.previousValue = result;
            } catch (error) {
                console.error('Calculation error:', error);
                this.showError('Error');
                return;
            }
        }

        // Set up for next number input
        this.waitingForNewValue = true;
        this.operator = nextOperator;
    }

    /**
     * Performs final calculation and displays the result
     * 
     * Executes pending mathematical operation, resets calculation state,
     * and prepares for new calculations. Handles error cases gracefully.
     * 
     * @example
     * ```typescript
     * calculator.inputNumber('10');
     * calculator.inputOperator('/');
     * calculator.inputNumber('2');
     * calculator.calculate(); // Displays "5"
     * ```
     */
    private calculate(): void {
        if (this.operator && this.previousValue !== null && !this.waitingForNewValue) {
            try {
                const result = this.performCalculation();
                this.currentValue = String(result);
                this.previousValue = null;          // Clear previous value
                this.operator = null;               // Clear operator
                this.waitingForNewValue = true;     // Result becomes starting point for next calculation
            } catch (error) {
                console.error('Calculation error:', error);
                this.showError('Error');
                return;
            }
        }

        this.clearActiveOperator();
    }

    /**
     * Performs the actual calculation between two numbers
     * @returns The calculation result
     * @private
     */
    private performCalculation(): number {
        const prev = this.previousValue!;
        const current = parseFloat(this.currentValue);
        
        // Validate inputs
        if (isNaN(prev) || isNaN(current)) {
            throw new Error('Invalid number in calculation');
        }
        
        let result: number;
        
        switch(this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            default:
                result = current;
        }
        
        // Check for overflow or invalid results
        if (!Number.isFinite(result)) {
            throw new Error('Result is not finite');
        }
        
        // Round to avoid floating point precision issues
        return Math.round(result * 1000000000000) / 1000000000000;
    }

    /**
     * Handles decimal point input for floating-point numbers
     * 
     * Validates decimal input, prevents multiple decimal points,
     * and handles new decimal numbers after operators.
     * 
     * @example
     * ```typescript
     * calculator.inputDecimal();    // Shows "0."
     * calculator.inputNumber('5');  // Shows "0.5"
     * ```
     */
    private inputDecimal(): void {
        if (this.waitingForNewValue) {
            // Start new decimal number
            this.currentValue = '0.';
            this.waitingForNewValue = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            // Add decimal point if none exists
            this.currentValue += '.';
        }
    }

    /**
     * Resets calculator to initial state (All Clear functionality)
     * 
     * Clears all state variables, resets display to zero,
     * and removes any active operator styling.
     * 
     * @example
     * ```typescript
     * calculator.clear(); // Resets to "0"
     * ```
     */
    private clear(): void {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForNewValue = false;
        this.hasError = false;
        this.clearActiveOperator();
    }

    /**
     * Toggles the sign of the current number (positive/negative)
     * 
     * Changes positive numbers to negative and vice versa.
     * Does not affect zero values.
     * 
     * @example
     * ```typescript
     * calculator.currentValue = "5";
     * calculator.negate(); // Changes to "-5"
     * calculator.negate(); // Changes back to "5"
     * ```
     */
    private negate(): void {
        if (this.currentValue !== '0') {
            this.currentValue = this.currentValue.startsWith('-') 
                ? this.currentValue.slice(1)      // Remove minus sign
                : '-' + this.currentValue;        // Add minus sign
        }
    }

    /**
     * Converts current number to percentage (divides by 100)
     * 
     * Applies percentage calculation to the current display value.
     * Useful for calculations involving percentages.
     * 
     * @example
     * ```typescript
     * calculator.currentValue = "50";
     * calculator.percent(); // Changes to "0.5" (50%)
     * ```
     */
    private percent(): void {
        this.currentValue = String(parseFloat(this.currentValue) / 100);
    }

    /**
     * Removes the last digit from the current number (backspace functionality)
     * 
     * Provides backspace functionality for number editing.
     * Resets to "0" if all digits are removed.
     * 
     * @private
     * 
     * @example
     * ```typescript
     * calculator.currentValue = "123";
     * calculator.backspace(); // Changes to "12"
     * calculator.backspace(); // Changes to "1"
     * calculator.backspace(); // Changes to "0"
     * ```
     */
    private backspace(): void {
        if (this.waitingForNewValue || this.currentValue === '0') {
            return;
        }

        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
    }

    /**
     * Removes visual highlighting from operator buttons
     * 
     * Clears the active state styling from previously selected operator buttons.
     * Provides visual feedback for the current operation state.
     * 
     * @private
     * 
     * @example
     * ```typescript
     * this.clearActiveOperator(); // Removes highlighting from all operator buttons
     * ```
     */
    private clearActiveOperator(): void {
        if (this.activeOperatorBtn) {
            this.activeOperatorBtn.classList.remove('active');
            this.activeOperatorBtn = null;
        }
    }

    /**
     * Updates the calculator display with proper formatting and responsive sizing
     * 
     * Handles number formatting, overflow cases, scientific notation,
     * and dynamically adjusts font size based on content length.
     * 
     * @example
     * ```typescript
     * this.currentValue = "1234567890123";
     * this.updateDisplay(); // Formats to scientific notation and adjusts font size
     * ```
     */
    private updateDisplay(): void {
        let displayValue = this.currentValue;

        console.log('updateDisplay called with:', displayValue); // Debug log

        // Handle long numbers - use scientific notation for very long numbers
        if (displayValue.length > 9) {
            const num = parseFloat(displayValue);
            displayValue = num.toExponential(6);
        }
        
        // Handle decimal precision - limit decimal places for long decimal numbers
        if (displayValue.includes('.') && displayValue.length > 9) {
            const num = parseFloat(displayValue);
            displayValue = num.toFixed(6).replace(/\.?0+$/, '');  // Remove trailing zeros
        }

        // Update the DOM display element
        console.log('Setting display text to:', displayValue); // Debug log
        this.display.textContent = displayValue;

        // Responsive font sizing - smaller font for longer numbers
        if (displayValue.length > 7) {
            this.display.style.fontSize = '2.5rem';
        } else {
            this.display.style.fontSize = '3rem';
        }

        // Remove error state styling if present
        this.display.classList.remove('error-state');
    }

    /**
     * Updates accessibility attributes for the display element
     * 
     * Maintains screen reader compatibility by updating ARIA labels
     * and live region announcements for display changes.
     * 
     * @private
     */
    private updateDisplayAccessibility(): void {
        const displayValue = this.display.textContent || '0';
        this.display.setAttribute('aria-label', `Calculator display showing: ${displayValue}`);
    }

    /**
     * Shows error message and auto-clears after timeout
     * @param message - Error message to display
     * @private
     */
    private showError(message: string): void {
        this.display.textContent = message;
        this.display.classList.add('error-state');
        
        // Auto-clear error after 2 seconds
        setTimeout(() => {
            this.clear();
            this.updateDisplay();
            this.updateDisplayAccessibility();
        }, 2000);
    }

    /**
     * Handles focus events for improved accessibility
     * 
     * @param event - The focus event
     * @private
     */
    private handleFocusIn(event: FocusEvent): void {
        const target = event.target as HTMLElement;
        if (target.classList.contains('btn')) {
            // Announce button purpose to screen readers
            target.setAttribute('aria-describedby', target.title || '');
        }
    }

}

/**
 * Application Initialization
 * 
 * Initializes the calculator when the DOM is fully loaded.
 * Uses DOMContentLoaded event to ensure all DOM elements exist
 * before creating the calculator instance.
 * 
 * @example
 * ```typescript
 * // Automatically runs when page loads
 * document.addEventListener('DOMContentLoaded', () => {
 *   new Calculator();
 * });
 * ```
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        new Calculator();
        console.log('Calculator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize calculator:', error);
        // Could show user-friendly error message in UI
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Calculator failed to load. Please refresh the page.';
        errorDiv.style.cssText = 'color: red; text-align: center; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif;';
        document.body.appendChild(errorDiv);
    }
});