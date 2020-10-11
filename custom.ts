
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace IoT_client {
        //% block
    export function register_device () {
        basic.clearScreen()
        if (identity < 0) {
            while (identity < 0) {
                radio.sendValue("register", 0)
                led.toggle(2, 2)
                basic.pause(200)
            }
        } else {
            basic.showString("already registered")
        }
        basic.clearScreen()
        who()
    }
    //% block
    export function unregister_device () {
        basic.clearScreen()
        if (identity >= 0) {
            radio.sendValue("del", control.deviceSerialNumber())
            led.toggle(2, 2)
            basic.pause(1000)
        } else {
            basic.showString("already deleted")
        }
    }
    //% block
    export function showRadioChannel(): number {
        return(101)
    }
}

radio.onReceivedString(function (receivedString) {
    serialRead = receivedString
    doCommands = true
    cloud2device()
})

radio.onReceivedValue(function (name, value) {
    if (identity >= 0) {
        if (name == "token" && value == control.deviceSerialNumber()) {
            Telemetry()
            device2cloud()
            debug()
            eom()
        }
    }
})

radio.setGroup(101)
radio.setTransmitSerialNumber(true)
radio.setTransmitPower(7)