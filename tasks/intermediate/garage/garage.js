class Vehicle {
    constructor(kind, make, reg, faults) {
        this.kind = kind
        this.make = make
        this.reg = reg
        this.faults = faults
    }
    getFixFee() {
        // Each line in the faults info is considered one fault

        let numlines = ((this.faults || '').match(/\n/g) || []).length
        return numlines * ((this.kind === 'Motorbike') ? 100 : 130)
    }
    toString() {
        return `${this.make} ${this.kind}: ${this.reg}`
    }
}

function Garage(name) {
    this.name = name;

    let vehicles = []
    let updateListeners = []

    this.getVehicle = function (index) {
        return vehicles[index]
    }

    this.addVehicle = function (vehicle) {
        // Push returns the new length, 
        // so return the index of added vehicle
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

    this.removeVehicle = function (ind) {
        vehicles.splice(ind, 1)
        updateListeners.forEach(e => e.call(null))
    }

    return this
}