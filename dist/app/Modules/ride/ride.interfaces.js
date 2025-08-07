"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRideStatus = void 0;
var IRideStatus;
(function (IRideStatus) {
    IRideStatus["REQUESTED"] = "requested";
    IRideStatus["ACCEPTED"] = "accepted";
    IRideStatus["PICKED_UP"] = "picked_up";
    IRideStatus["IN_TRANSIT"] = "in_transit";
    IRideStatus["COMPLETED"] = "completed";
    IRideStatus["CANCELED"] = "canceled";
})(IRideStatus || (exports.IRideStatus = IRideStatus = {}));
