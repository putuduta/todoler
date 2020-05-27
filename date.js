 //jshint esversion:6

 //export the module

 //export the date
  exports.getDate = () => {
     //day function
     const today = new Date();

     const option = {
         weekday: 'long',
         day: 'numeric',
         month: 'long'
     };

     return today.toLocaleDateString('en-UK', option);
 };

//export the day
 exports.getDay = () => {
     //day function
     const today = new Date();

     const option = {
         weekday: 'long',
     };

     return today.toLocaleDateString('en-UK', option);
 };