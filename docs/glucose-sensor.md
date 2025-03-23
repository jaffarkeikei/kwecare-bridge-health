# Arduino Blood Glucose Measurement Simulator

## Overview  
This project simulates a blood glucose measurement device using an Arduino and a touch sensor. When the sensor is touched, the device generates a random blood glucose level and provides feedback via LED lights:  

- **Green LED:** Indicates that the glucose level is within a healthy (non-prediabetic) range.  
- **Red LED:** Indicates that the glucose level is above prediabetic levels.  

The purpose of this gadget is to simulate basic glucose level detection and provide visual feedback based on generated values.

---

## Features  
- **Touch Sensor Activation:**  
  - The system measures glucose level (simulated as a random number) when the touch sensor is activated.  
  - Random glucose levels are generated to mimic real measurements.
  
- **LED Feedback:**  
  - **Green LED** flashes if the glucose level is within the healthy range (e.g., below 140 mg/dL).  
  - **Red LED** flashes if the glucose level exceeds the prediabetic threshold (e.g., above 140 mg/dL).

---

## Components Used  
1. **Arduino Board (e.g., Arduino Uno)**  
2. **Touch Sensor Module**  
3. **LEDs**: Green and Red  
4. **Resistors (220 Ohm)**  
5. **Breadboard and Jumper Wires**  

---

## Code Logic  
1. When the device is powered on, it initializes the touch sensor and LEDs.  
2. Once the sensor detects a touch:  
   - A random glucose level is generated between a specified range (e.g., 0 - 200 mg/dL).  
   - If the glucose level is below the prediabetic threshold (e.g., 120 mg/dL), the **green LED** flashes.  
   - If the glucose level is at or above the threshold, the **red LED** flashes.  
3. The random glucose level can be displayed via serial monitor if desired.  

---

## How to Use  
1. Connect the components as shown in the circuit diagram (see the section below).  
2. Upload the Arduino sketch to your board using the Arduino IDE.  
3. Open the serial monitor (optional) to view the generated glucose values.  
4. Touch the sensor to simulate a glucose measurement:  
   - Observe the LED feedback based on the generated glucose level.  

---

## Circuit Diagram  
*Placeholder for circuit image*
Arduino Uno
+---------------------------+
|                           |
|  5V -----> Breadboard (+) |
| GND -----> Breadboard (-) |
| D2  -----> Touch Sensor S |
| D3  -----> Green LED (+)  |
| D4  -----> Red LED (+)    |
|                           |
+---------------------------+

Breadboard Layout:
+---------------------------------------------+
|          +5V Rail        |       GND Rail   |
|           |               |         |       |
| Touch     |               |         |       |
| Sensor ---+               +---------+       |
|                                               
| Green LED (+) ----------> Resistor ----------> D3
| Red LED (+) ------------> Resistor ----------> D4
+---------------------------------------------+

## Example Output  
- **Generated Glucose Level:** 100 mg/dL → **Green LED** flashes (Healthy range)  
- **Generated Glucose Level:** 160 mg/dL → **Red LED** flashes (Prediabetic range)

---

## Future Improvements  
- Add an LCD screen to display the glucose level directly on the device.  
- Implement Bluetooth or Wi-Fi to transmit data to a smartphone app.  
- Use real sensor data (e.g., optical sensors) instead of random number generation.  
- Customize thresholds to match user-specific health needs.  

---

## Disclaimer  
This device is **not a medical tool** and is intended for educational and simulation purposes only. It does not provide actual blood glucose readings and should not be used to diagnose or monitor any medical condition.  
