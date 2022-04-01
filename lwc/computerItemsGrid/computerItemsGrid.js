import { LightningElement,track } from 'lwc';
import getData from '@salesforce/apex/ComputerItemGridController.getData';
export default class ComputerItemsGrid extends LightningElement {
    @track resultArray = [];
    @track activeTotal = 0;
    @track deletedTotal = 0;
    connectedCallback() {
        getData({}).then((result)=>{
            const resultData = JSON.parse(result);
            for (let key in resultData) {
                var activeSubTotal = 0;
                resultData[key].forEach((item) => {
                    activeSubTotal += item.price;
                });
                this.resultArray.push({type : key, active : resultData[key], activeSubTotal : activeSubTotal, deleted : [], deletedSubTotal : 0});
                this.activeTotal += activeSubTotal;
            }
            console.log('JSON.parse(result) : ',JSON.parse(result));
            console.log('OUTPUT : ',this.resultArray);
        })
    }
    handleRemove(event){
        var childindex = event.currentTarget.dataset.childindex;
        var parentindex = event.currentTarget.dataset.parentindex;
        this.resultArray[parentindex].deleted.push(this.resultArray[parentindex].active[childindex]);
        this.resultArray[parentindex].active = this.resultArray[parentindex].active.filter((item, index) => {
            return index != childindex;
        });
        this.updateTotal();
    }
    handleRestore(event){
        var childindex = event.currentTarget.dataset.childindex;
        var parentindex = event.currentTarget.dataset.parentindex;
        this.resultArray[parentindex].active.push(this.resultArray[parentindex].deleted[childindex]);
        this.resultArray[parentindex].deleted = this.resultArray[parentindex].deleted.filter((item, index) => {
            return index != childindex;
        });
        this.updateTotal();
    }

    updateTotal(){
        this.activeTotal = 0;
        this.deletedTotal = 0;
        this.resultArray = this.resultArray.map((item) => {
            item.activeSubTotal = 0;
            item.deletedSubTotal = 0;
            item.active.forEach((active)=>{
                item.activeSubTotal += active.price;
            });
            item.deleted.forEach((deleted)=>{
                item.deletedSubTotal += deleted.price;
            });
            this.activeTotal += item.activeSubTotal;
            this.deletedTotal += item.deletedSubTotal;
            return item;
        });
    }
}