"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryOrder = void 0;
const typeorm_1 = require("typeorm");
let DeliveryOrder = class DeliveryOrder {
};
exports.DeliveryOrder = DeliveryOrder;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeliveryOrder.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rider_id' }),
    __metadata("design:type", String)
], DeliveryOrder.prototype, "riderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'driver_id', nullable: true }),
    __metadata("design:type", String)
], DeliveryOrder.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'route_id', nullable: true }),
    __metadata("design:type", String)
], DeliveryOrder.prototype, "routeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['draft', 'requested', 'accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed'], default: 'draft' }),
    __metadata("design:type", String)
], DeliveryOrder.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json' }),
    __metadata("design:type", Object)
], DeliveryOrder.prototype, "pickup", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json' }),
    __metadata("design:type", Object)
], DeliveryOrder.prototype, "dropoff", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Array)
], DeliveryOrder.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], DeliveryOrder.prototype, "fare", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DeliveryOrder.prototype, "qrCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeliveryOrder.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeliveryOrder.prototype, "updatedAt", void 0);
exports.DeliveryOrder = DeliveryOrder = __decorate([
    (0, typeorm_1.Entity)('delivery_orders')
], DeliveryOrder);
//# sourceMappingURL=delivery-order.entity.js.map