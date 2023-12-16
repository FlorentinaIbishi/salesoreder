sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    'sap/f/library',
    'sap/ui/model/Sorter',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, fioriLibrary, Sorter, Fragment, Filter) {
        "use strict";

        return Controller.extend("ap.salesoreder.controller.Main", {
            onInit: function () {
           // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			    this._mViewSettingsDialogs = {};
            },

            onListItemPress: function (oEvent) {
                let ssalesorderPath = oEvent.getSource().getBindingContext().getPath(),
                oSelectedsalesorder = ssalesorderPath.split("'")[1]; // We split the path /CustomerSet('145999') into 3 pieces by splitting on '
            
                this.getOwnerComponent().getRouter().navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, salesorder: oSelectedsalesorder});
            },
            handleSortButtonPressed: function () {
                this.getViewSettingsDialog("ap.salesoreder.fragments.sortDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },
            getViewSettingsDialog: function (sDialogFragmentName) {
                var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

                if (!pDialog) {
                    pDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: sDialogFragmentName,
                        controller: this
                    }).then(function (oDialog) {
                        if (Device.system.desktop) {
                            oDialog.addStyleClass("sapUiSizeCompact");
                        }
                        return oDialog;
                    });
                    this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
                }
                return pDialog;
            },
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.byId("salesorderTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },
            handleFilterButtonPressed: function () {
                this.getViewSettingsDialog("ap.salesoreder.fragments.filterDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },
            handleFilterDialogConfirm: function (oEvent) {
                var oTable = this.byId("salesorderTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                mParams.filterItems.forEach(function(oItem) {
                    let sPath = oItem.getParent().getKey(),
                        sOperator = 'EQ',
                        sValue1 = oItem.getKey(),
                        oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });

                // apply filter settings
                oBinding.filter(aFilters);

                // update filter bar
                // this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
                // this.byId("vsdFilterLabel").setText(mParams.filterString);
            },
            onAddButtonPress: function() {
                var oView =  this.getView();

                if(!this.oDialog) {
                    this.oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "ap.salesoreder.fragments.AddDialog",
                        controller: this
                    }).then(function(oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this.oDialog.then(function(oDialog) {
                    oDialog.open();
                })
            },

            onAddSalesorder: function(){
                var salesorderval = {
                    Vbeln: this.byId("iVbeln").getValue(),
                    Erdat: this.byId("iErdat").getValue()
                };

                this.oDialog.then(function(oDialog) {
                    oDialog.close();
                });
            },
            onCancelAddsalesorder: function(){
                this.oDialog.then(function(oDialog) {
                    oDialog.close();
                });
            }
        });
    });
