
class Expense 
{
	constructor(year, month, day, category, description, amount) 
   {
		this.year = year 
		this.month = month
		this.day = day
		this.category = category
		this.description = description
		this.amount = amount
	}

	validateData() 
   {

		for(let attribute in this) 
      { 
			if(this[attribute] == undefined  
            || this[attribute] == '' 
            ||  this[attribute] == null)  
            {
					return false 
            }
		}

		return true 
	}
}

class Database 
{

	constructor() {

		let ID = localStorage.getItem('ID')
		
		if (ID === null) 
      {

			localStorage.setItem('ID', 0)  
		}
	}


    getNextID() 
    {
    	let nextID = localStorage.getItem('ID')

    	return parseInt(nextID) + 1
    }
		
	 recordData(expenseObject) 
    { 
		let ID = this.getNextID()

		localStorage.setItem('ID', ID)

      localStorage.setItem(ID, JSON.stringify(expenseObject))
    }
    
    getAllRecords() 
    {

 	   let expensesArray = Array()

    	let ID = localStorage.getItem('ID')
      
      for (let i = 1; i <= ID; i++) 
      {
         let expenseObject = JSON.parse(localStorage.getItem(i))
      
         if(expenseObject === null) 
         {
         	continue 
         }
      
         expenseObject.ID = i

         expensesArray.push(expenseObject)
      }

	    return expensesArray
   }

   filter(requiredExpense) 
   {

      let filteredExpenses = Array()
      filteredExpenses = this.getAllRecords()
  
	   if (requiredExpense.year != '') 
      {
         filteredExpenses = filteredExpenses.filter(
            expenseArray => expenseArray.year == requiredExpense.year)
	   }

	   if (requiredExpense.month != '') 
      {

         filteredExpenses = filteredExpenses.filter(
            expenseArray => expenseArray.month == requiredExpense.month)
	   }

	    if (requiredExpense.day != '') 
       {
         filteredExpenses = filteredExpenses.filter(
            expenseArray => expenseArray.day == requiredExpense.day)
	    }

	   if (requiredExpense.category != '') 
      {
         filteredExpenses = filteredExpenses.filter(
            expenseArray => expenseArray.category == requiredExpense.category)
	   }

	   if (requiredExpense.amount != '') 
      {
         filteredExpenses = filteredExpenses.filter(
            expenseArray => expenseArray.amount == requiredExpense.amount)
	   }
	   return (filteredExpenses)
 
    }

    deleteExpense(ID) 
    {
    	localStorage.removeItem(ID) 
    }
  
}

let database = new Database()

function recordExpense() 
{

	let year = document.getElementById('year')
	let month = document.getElementById('month')
	let day = document.getElementById('day')
	let category = document.getElementById('category')
	let description = document.getElementById('description')
	let amount = document.getElementById('amount')

   let expense = new Expense(
		year.value, 
		month.value, 
		day.value, 
		category.value, 
		description.value, 
		amount.value
		)


    if (expense.validateData()) 
    {  

		  database.recordData(expense)
		
        document.getElementById('modalTitle').innerHTML = 'Success'
		  document.getElementById('modalTitleDiv').className = 'modal-header font-weight-bold text-success'
		  document.getElementById('modalContent').innerHTML = 'Your new expense was recorded!'
		  document.getElementById('modalButton').innerHTML = 'Return'
		  document.getElementById('modalButton').className = 'btn btn-sucess font-weight-bold'

         $('#expenseRecordModal').modal('show')

         year.value = ''
         month.value = ''
         day.value = ''
         category.value = ''
         description.value = ''
         amount.value = ''
    
    } 
    else 
    {

         document.getElementById('modalTitle').innerHTML = 'Error'
		   document.getElementById('modalTitleDiv').className = 'modal-header font-weight-bold text-danger'
    	   document.getElementById('modalContent').innerHTML = 'Make sure there are no empty fields in the New Expense recording form'
    	   document.getElementById('modalButton').innerHTML = 'Try Again'
    	   document.getElementById('modalButton').className = 'btn btn-danger font-weight-bold'
 
     	   $('#expenseRecordModal').modal('show')
    
    }
}


function getExpensesList(expensesArray = Array(), filters = false) 
{
   
   if (expensesArray.length == 0 && filters == false) 
   {
   	expensesArray = database.getAllRecords()  

   }

   var totalAmount = 0 

   for (let i = 0; i < expensesArray.length; i++) 
   {
      
      expensesArray[i].amount = expensesArray[i].amount.replace(/,/g, '.')
      expensesArray[i].amount = expensesArray[i].amount.replace(/\$/g, '')
      totalAmount += parseFloat(expensesArray[i].amount)
      totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100
   } 

   let expensesList = document.getElementById('expensesList')
  
   expensesList.innerHTML = ''

   expensesArray.forEach(function(expense)
   {
  
	    let row = expensesList.insertRow()
  
       row.insertCell(0).innerHTML = `${expense.month}/${expense.day}/${expense.year}` 
      
       
       switch(parseInt(expense.category)) 
       { 
   
	       case 1: expense.category = 'Groceries'
		       break
		    case 2: expense.category = 'Hobbies'
		       break
		    case 3: expense.category = 'Entertainment'
		       break
		    case 4: expense.category = 'Health'
		       break
		    case 5: expense.category = 'Transport'
		       break

       }

       row.insertCell(1).innerHTML = expense.category 
       row.insertCell(2).innerHTML = expense.description 
       row.insertCell(3).innerHTML = `$${expense.amount}`

       let deleteButton = document.createElement("button")

       deleteButton.className = 'btn btn-danger font-weight-bold'
  
       deleteButton.innerHTML = '<i class="fas fa-times"></i>&nbsp;&nbsp;Delete'

       deleteButton.id = `expense_ID_${expense.ID}`

       deleteButton.onclick = function() 
       {
       	
            let id = this.id.replace('expense_ID_', '')
       	
            database.deleteExpense(id) 
       
            window.location.reload()
       }


       row.insertCell(4).append(deleteButton) 

       row.className = "expenseRow"
       
    }) 

   
   
   let lastrow = expensesList.insertRow()
   lastrow.insertCell(0).innerHTML = ''
   lastrow.insertCell(1).innerHTML = ''
   lastrow.insertCell(2).innerHTML = '<br><span class="d-flex justify-content-end text-danger font-weight-bold" id="totalAmountLabel">Total Amount:</span>'
   lastrow.insertCell(3).innerHTML = `<br><span class="font-weight-bold" id="totalAmountValue ">$${totalAmount}</span>`


} 

   
function filterExpense() 
{
   let year = document.getElementById('year').value
   let month = document.getElementById('month').value 
   let day = document.getElementById('day').value 
   let category = document.getElementById('category').value 
   let description = ''
   let amount = document.getElementById('amount').value 
   
   expense = new Expense(year, month, day, category, description, amount)
   
   let filteredExpensesArray = database.filter(expense)

   getExpensesList(filteredExpensesArray, true)

}


