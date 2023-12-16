sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ap.salesoreder.controller.SalesOrderDetail", {
            onInit: function () {
                let oRouter = this.getOwnerComponent().getRouter()
                oRouter.getRoute("master").attachPatternMatched(this._onSalesorderMatched, this);
                oRouter.getRoute("detail").attachPatternMatched(this._onSalesorderMatched, this);
            },
            _onSalesorderMatched: function (oEvent) {
                var sSalesorderID = oEvent.getParameter("arguments").salesorder || "0";
                var sSalesorderPath = `/sales_orderSet('${sSalesorderID}')`;
            
                this.getView().bindElement({
                    path: sSalesorderPath,
                });
            
                var oTable = this.getView().byId("salesorderitemTable");
                oTable.bindItems({
                    path: sSalesorderPath + "/sales_order_itemSet",
                    template: oTable.getBindingInfo("items").template
                });
            },
                   

            onExit: function () {
                this.oRouter.getRoute("list").detachPatternMatched(this._onSalesorderMatched, this);
                this.oRouter.getRoute("detail").detachPatternMatched(this._onSalesorderMatched, this);
            }
        });
    });