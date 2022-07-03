import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit, NgModule, Input, Output } from '@angular/core';
// import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MyDialogComponent } from '../my-dialog/my-dialog.component';




@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.sass']
})
export class NewUserComponent implements OnInit {
  
  protected aFormGroup: FormGroup;

  name:any='';
  surName:any='';
  birthday:any;
  email:any='';
  isNameChanged:boolean=false;
  isSurNameChanged:boolean=false;
  isBirthdayChanged:boolean=false;
  isValidEmail:boolean=false;
  invalidEmail:boolean=false;
  isEmailChanged:boolean=false;
  emailIsTouched:boolean=false;
  invalidName:boolean=false;
  validName:boolean=false;
  invalidSurName:boolean=false;
  validSurName:boolean=false;
  allIsValid:boolean=false;
  validCaptcha:boolean=false;
  validBirthday:boolean=false;
  invalidBirthday:boolean=false;
  saveDone:boolean=false;
  saveError:boolean=false;
  dataDialog:any;

  currentYear: Date;

  patternEmail:any="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  siteKey='6LeyoK8gAAAAACTS2aU4CaH2re69aPmucwfRZ542';


  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {

    this.aFormGroup =this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

    this.currentYear = new Date("YYYY");
   }

  ngOnInit(): void {

    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  isAllValid(){
    let aux = false;

    this.isValidName();
    this.isValidSurName();
    this.isValidBirthday();
    this.emailValidations();
   
    if(this.aFormGroup && this.aFormGroup.status === 'VALID'){
      this.validCaptcha = true;
    }

    if(this.validName && this.validSurName && this.validBirthday && this.isValidEmail && this.validCaptcha){
      this.allIsValid = true;
      this.saveDataUser();
    }

    // return aux;
  }


  isValidName(){
    this.validName=false;
    this.invalidName=false;

    if(this.name && this.name.length > 2){
      this.validName = true;
    }else{
      this.invalidName = true;
    }
  }

  isValidSurName(){
    this.validSurName = false;
    this.invalidSurName = false;

    if(this.surName && this.surName.length > 1){
      this.validSurName = true;
    }else{
      this.invalidSurName = true;
    }
  }

  isValidBirthday(){
    this.validBirthday=false;
    this.invalidBirthday=false;
    this.currentYear = new Date();

    if(this.birthday && this.birthday._isValid){
      this.validBirthday = true;
    }else{
      this.invalidBirthday=true;
    }  
  }

  emailValidations(){
    this.isValidEmail=false;
    this.invalidEmail=false;
    let regexp = new RegExp(this.patternEmail)

    if(regexp.test(this.email)){
      this.isValidEmail=true;
    }else{
      this.invalidEmail = true;
    }
    
  }

  saveDataUser(){

    let dataUser={
      name: this.name,
      surName: this.surName,
      birthday: this.birthday._d.toLocaleDateString(),
      email: this.email
    };

    try{
      localStorage.setItem('dataUser',JSON.stringify(dataUser));
      this.saveDone = true;
      this.openDialogSucces();
    }catch(e){
      this.saveError = true;
      this.openDialogError();
    }

  }

  openDialogSucces(): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      width: '600px',
      data: {name:"Enhorabuena!", message:"Exito al guardar los datos del usuario"},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataDialog = result;
      this.resetData();
    });
  }

  openDialogError(): void {
    const dialogRef = this.dialog.open(MyDialogComponent, {
      width: '500px',
      data: {name:"Ups!", message:"Error al guardar los datos del usuario"},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataDialog = result;
      this.resetData();
    });
  }

  resetData(){
    window.location.reload();
    this.birthday=null;
    this.name='';
    this.surName='';
    this.email='';
    this.aFormGroup.reset();
  }

}
