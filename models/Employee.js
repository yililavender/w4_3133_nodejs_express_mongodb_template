const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required:[true, "first name is required"],
    trim:true,
    lowercase:true

  },
  lastname: {
    type: String,
    required:true,
    trim:true,
    lowercase:true
  },
  email: {
    type: String,
    required:true,
    trim:true,
    lowercase:true
  },
  gender: {
    type: String,
    required:true,
    trim:true,
    lowercase:true
  },
  city:{
    type: String,
    required:true,
    trim:true,
    lowercase:true
  },
  designation: {
    type: String,
    required:true,
  },
  salary: {
    type: Number,
    required:true,
    validate(value){
      if(salary < 0.0){
        throw new Error("negative salary is not allowed!")
      }
    }
  },
  created: { 
    type: Date,
    default: Date.now
  },
  updatedat: { 
    type: Date,
    default: Date.now
  },
});

//Declare Virtual Fields
EmployeeSchema.virtual("fullname")
.get(function(){
  return `${this.firstname} ${this.lastname}`
})

//Custom Schema Methods
//1. Instance Method Declaration

EmployeeSchema.methods.getFullName = function(){
  return `${this.firstname} ${this.lastname}`
}

EmployeeSchema.methods.getFormattedSalary = function(){
  return `$${this.salary}`
}
//2. Static method declararion
EmployeeSchema.statistics.getEmployeeById = function(eid){
  return this.find({_id: eid}).select("firstname lastname salary");
}


//Writing Query Helpers
EmployeeSchema.query.sortByFirstName = function(flag){ //flag 1 or -1
  return this.sort({'firstname': flag});
}

EmployeeSchema.query.byFirstName = function(name){
  return this.where({'firstname': name});
}


EmployeeSchema.pre('save', (next) => {
  console.log("Before Save")
  let now = Date.now()
   
  this.updatedat = now
  // Set a value for createdAt only if it is null
  if (!this.created) {
    this.created = now
  }
  
  // Call the next function in the pre-save chain
  next()
});

EmployeeSchema.pre('findOneAndUpdate', (next) => {
  console.log("Before findOneAndUpdate")
  let now = Date.now()
  this.updatedat = now
  console.log(this.updatedat)
  next()
});


EmployeeSchema.post('init', (doc) => {
  console.log('%s has been initialized from the db', doc._id);
});

EmployeeSchema.post('validate', (doc) => {
  console.log('%s has been validated (but not saved yet)', doc._id);
});

EmployeeSchema.post('save', (doc) => {
  console.log('%s has been saved', doc._id);
});

EmployeeSchema.post('remove', (doc) => {
  console.log('%s has been removed', doc._id);
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;