class Vehicle {
    constructor(kind, make, reg, faults) {
        this.kind = kind
        this.make = make
        this.reg = reg
        this.faults = faults
    }
    getFaults() {
        if (!this.faults)
            return []
        return (this.faults).split(/\n+/)
    }
    numFaults() {
        return this.getFaults().length
    }
    getFixFee() {
        return this.numFaults() * ((this.kind === 'Motorbike') ? 100 : 130)
    }
    getFixFeeString() {
        return '£ ' + this.getFixFee()
    }
    toString() {
        let ret = `${this.make} ${this.kind}: ${this.reg}`

        if (this.numFaults() > 0)
            ret += ` (${this.numFaults()} faults -- ${this.getFixFeeString()})`
        return ret
    }
}

function Garage(name) {
    this.name = name;

    let vehicles = []
    let updateListeners = []

    this.getTotalFee = function () {
        if (vehicles && vehicles.length > 0)
            return vehicles.map(e => e.getFixFee()).reduce((a, b) => a + b)
        return 0
    }

    this.getTotalFeeString = function () {
        return '£ ' + this.getTotalFee()
    }

    this.getVehicle = function (index) {
        return vehicles[index]
    }

    this.addVehicle = function (vehicle) {
        // Push returns the new length, 
        // so return the index of added vehicle
        // Cannot add duplicate vehicles
        if (vehicles.filter(e => e.reg == vehicle.reg).length > 0)
            return null
        let ret = vehicles.push(vehicle) - 1
        updateListeners.forEach(e => e.call(null))
        return ret
    }

    this.vehicles = function () {
        return vehicles.slice()
    }

    this.addUpdateListener = function (cb) {
        updateListeners.push(cb)
    }

    this.getVehicleIndex = function (v) {
        return vehicles.indexOf(v)
    }

    this.removeVehicle = function (ind) {
        vehicles.splice(ind, 1)
        updateListeners.forEach(e => e.call(null))
    }

    return this
}