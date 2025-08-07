"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDriverStatus = exports.IDiverApprove = void 0;
var IDiverApprove;
(function (IDiverApprove) {
    IDiverApprove["PENDING"] = "pending";
    IDiverApprove["APPROVED"] = "approved";
    IDiverApprove["SUSPEND"] = "suspend";
    IDiverApprove["REFUSE"] = "refuse";
})(IDiverApprove || (exports.IDiverApprove = IDiverApprove = {}));
var IDriverStatus;
(function (IDriverStatus) {
    IDriverStatus["IDLE"] = "idle";
    IDriverStatus["ACCEPTED"] = "accepted";
    IDriverStatus["PICKEDUP"] = "picked_up";
    IDriverStatus["INTRANSIT"] = "in_transit";
    IDriverStatus["COMPLETED"] = "completed";
})(IDriverStatus || (exports.IDriverStatus = IDriverStatus = {}));
