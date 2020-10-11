
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
serialRead = ""
doCommands = false