import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../../../services/auth-service';
import {OrdersService} from '../../../services/orders-service';
import {CarPartOrder} from '../../../models/CarPartOrder';
import {CarPartOrderRequest} from '../../../models/CarPartOrderRequest';
import {OrderItem} from '../../../models/OrderItem';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PublicCarService} from '../../../services/public-car-service';
import {CarPartsService} from '../../../services/car-parts-service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  pendingUpdate: { orderId: number, status: string } | null = null;
  currentPage = 0;
  totalPages = 0;
  orders: CarPartOrder[] = [];
  statuses = ['PENDING', 'CONFIRMED', 'DECLINED'];
  filterOptions = ['ALL', 'PENDING', 'CONFIRMED', 'DECLINED'];
  selectedStatus = 'ALL';
  isAdmin = false;

  selectedOrder?: CarPartOrder;
  detailedItems: { item: OrderItem, image?: string, reference?: string }[] = [];

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private partService: CarPartsService,
    private publicCarService: PublicCarService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadData();
  }

  onFilterChange(status: string) {
    this.selectedStatus = status;
    this.loadData(0);
  }

  loadData(page: number = 0) {
    this.currentPage = page;
    if (this.isAdmin) {
      this.loadAllOrders(page, this.selectedStatus);
    } else {
      const email = this.authService.getEmail();
      if (email) this.loadUserOrders(email, page, this.selectedStatus);
    }
  }

  loadAllOrders(page: number, status: string) {
    this.ordersService.getAllOrders(page, status).subscribe((data) => {
      this.orders = data.content;
      this.totalPages = data.totalPages;
    });
  }

  loadUserOrders(email: string, page: number, status: string) {
    this.ordersService.getOrdersByUser(email, page, status).subscribe((data) => {
      this.orders = data.content;
      this.totalPages = data.totalPages;
    });
  }

  updateStatus(orderId: number, status: string) {
    this.ordersService.updateStatus(orderId, status).subscribe(() => {
      this.loadData(this.currentPage);
    });
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  getOrderTotal(order: CarPartOrder): number {
    return order.items.reduce(
      (sum, item) => sum + item.partPrice * item.quantity,
      0
    );
  }


  getSubtotal(order: CarPartOrder): number {
    return order.items.reduce(
      (sum, item) => sum + item.partPrice * item.quantity,
      0
    );
  }


  getDeliveryFee(order: CarPartOrder): number {
    const subtotal = this.getSubtotal(order);
    return subtotal >= 250 ? 0 : 7;
  }


  getTotalAmount(order: CarPartOrder): number {
    return this.getSubtotal(order) + this.getDeliveryFee(order);
  }


  isEditable(orderStatus: string): boolean {
    return orderStatus === 'PENDING';
  }

  onStatusChange(orderId: number, newStatus: string) {
    this.pendingUpdate = { orderId, status: newStatus };
  }

  confirmUpdate() {
    if (this.pendingUpdate) {
      this.ordersService.updateStatus(this.pendingUpdate.orderId, this.pendingUpdate.status)
        .subscribe(() => {
          this.pendingUpdate = null;
          this.loadData(this.currentPage);
        });
    }
  }

  cancelUpdate() {
    this.pendingUpdate = null;
    this.loadData(this.currentPage);
  }

  openOrderDetails(content: TemplateRef<any>, order: CarPartOrder) {
    this.selectedOrder = order;
    this.detailedItems = [];

    order.items.forEach(orderItem => {
      this.partService.getPart(orderItem.partId).subscribe(fullPart => {
        this.detailedItems.push({
          item: orderItem,
          image: fullPart.image ? this.publicCarService.getImageUrl(fullPart.image) : undefined,
          reference: fullPart.reference
        });
      });
    });

    this.modalService.open(content, { size: 'lg', centered: true });
  }
}
