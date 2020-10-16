
/**
 * Use this file to define custom functions and blocks.
 * Read more at https://makecode.microbit.org/blocks/custom
 */

/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon=""
namespace IoT_client {
    let radioGroup = 101
    let doTelemetry = true
    let doProperty = true
    let doD2C = true
    let doDebug = true

    setRadioChannel(101)
    radio.setTransmitSerialNumber(true)
    radio.setTransmitPower(7)

    //%block="send telemetry = $b"
    //% b.shadow="toggleOnOff"
    export function sendTelemetry(b: boolean) {
        doTelemetry = b
    }

    //%block="send property = $b"
    //% b.shadow="toggleOnOff"
    export function sendProperty(b: boolean) {
        doProperty = b
    }

    //%block="send device2cloud = $b"
    //% b.shadow="toggleOnOff"
    export function sendD2C(b: boolean) {
        doTelemetry = b
    }

    //%block="send debug info = $b"
    //% b.shadow="toggleOnOff"
    export function sendDebug(b: boolean) {
        doTelemetry = b
    }

    //% block
    export function registerDevice () {
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
    export function unregisterDevice () {
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
        return(radioGroup)
    }

    //% block
    export function setRadioChannel(n:number) {
        radioGroup = n
        radio.setGroup(n)
    }

    function telemetry () {
        if (doTelemetry) {
            radio.sendValue("id", identity)
            basic.pause(delay)
            radio.sendValue("sn", 0)
            basic.pause(delay)
            radio.sendValue("time", 0)
            basic.pause(delay)
            radio.sendValue("packet", 0)
            basic.pause(delay)
            radio.sendValue("signal", 0)
            basic.pause(delay)
            radio.sendValue("temp", input.temperature())
            basic.pause(delay)
            radio.sendValue("light", input.lightLevel())
            basic.pause(delay)
            radio.sendValue("accX", input.acceleration(Dimension.X))
            basic.pause(delay)
            radio.sendValue("accY", input.acceleration(Dimension.Y))
            basic.pause(delay)
            radio.sendValue("accZ", input.acceleration(Dimension.Z))
            basic.pause(delay)
            radio.sendValue("comp", 1)
            basic.pause(delay)
            radio.sendValue("dP0", pins.digitalReadPin(DigitalPin.P0))
            basic.pause(delay)
            radio.sendValue("dP1", pins.digitalReadPin(DigitalPin.P1))
            basic.pause(delay)
            radio.sendValue("dP2", pins.digitalReadPin(DigitalPin.P2))
            basic.pause(delay)
            radio.sendValue("aP0", pins.analogReadPin(AnalogPin.P0))
            basic.pause(delay)
            radio.sendValue("aP1", pins.analogReadPin(AnalogPin.P1))
            basic.pause(delay)
            radio.sendValue("aP2", pins.analogReadPin(AnalogPin.P2))
            basic.pause(delay)
        }    
    }

    function eom () {
        radio.sendValue("eom", 1)
        basic.pause(delay)
    }

    function device2cloud () {
        // send device property to the cloud
        if (doD2C) {
            radio.sendValue("device2cloud", 1)
            basic.pause(delay)
        }
    }

    function debug () {
        // send debug info to the cloud
        if (doDebug) {
            radio.sendValue("d:id", identity)
            basic.pause(delay)
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
                telemetry()
                device2cloud()
                debug()
                eom()
            }
        }
    })
}