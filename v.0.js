  const newPicker = (initDates) => {


      function showDatepicker(){
        let input = document.getElementById('input-id');

        let datepicker = new HotelDatepicker(input, {
            moveBothMonths: true,
            minNights: 2,
            disabledDates: initDates
        });


        // POST MAIL FUNCITON REPLACEMENT

      const queryBuilder = () => {
      let queryData = "";
      let dates = {};

      let checkIn = $("#check-in").text();
      let checkOut = $("#checkout").text();

      date = { startDate: checkIn, endDate: checkOut };

      let guestyId = $(element).find(".apartment_guesty-id").text();

      queryData = guestyId + `?startDate=${date.startDate}&endDate=${date.endDate}`;

        const options = {
        method: "GET",
        url: `https://guesty-bridge-restful-api.herokuapp.com/reservation/${queryData}`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "cors",
        },
      };

      return options;
    };

        const getData = (options) => {
          axios
            .request(options)
            .then(function (response) {
              //console.log("Then checkpoint");
              //console.log(response.data);
            })
            .catch(function (error) {
              //console.error(error);
            });
        };
  /*
        async function postMailData(url = '', data) {
              const response = await fetch(url, {
              method: 'POST',
              mode: 'cors',
              cache: 'no-cache',
              credentials: 'same-origin',
              headers: {
                'Content-Type': 'application/json'
                },
              redirect: 'follow',
              referrerPolicy: 'no-referrer',
              body: JSON.stringify(data)
          });
            return await response.json();
          }
           */
        input.addEventListener('afterClose', function(){
          let nights = datepicker.getNights();
          let val = datepicker.getValue();

           if(val != ''){
            let valSplit = val;
            valSplit = valSplit.split(' - ');
            let data = {
              guesty: '{{wf {&quot;path&quot;:&quot;guesty-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}',
              startDate: valSplit[0],
              endDate: valSplit[1],
            };


            axios
            .request(queryBuilder())
            .then(function (response) {

              let { minNights, status } = response.data;

              let nights = datepicker.getNights();

              if( ( status === 'available' ) && ( minNights <= nights ) ){
                document.querySelector('.unval-dates').style.display = 'none';

                calculateTotal(data);
              } else{
                document.querySelector('.unval-dates').style.display = 'block';

              }

            })
            .catch(function (error) {
              console.error(error);
            });

          
            splitData(val);
            showNights(nights);
          } else {
            alert('Choose, please, one or more nights');
         }
      });
       function splitData(data){
        data = data.split(' - ');
        document.getElementById('check-in').innerText = data[0];
        document.getElementById('checkout').innerText = data[1];
      }
      function showNights(night){
         document.querySelector('#night').innerText = night;
        //calculatePricePerNight(night);
      }
        /* function calculatePricePerNight(night){
          let calc = night*{{wf {&quot;path&quot;:&quot;dollars-per-night&quot;,&quot;type&quot;:&quot;Number&quot;\} }};
        } */
        function calculateTotal({ price }){
          price = Math.round(price + price * 0.154);
          let procFee = {{wf {&quot;path&quot;:&quot;payment-processing-fee&quot;,&quot;type&quot;:&quot;Number&quot;\} }};
          let priceString = price.toString();

          if(priceString.length > 3){
            console.log('nights selected', Number($('#night').text()));
            console.log('price', price);
            console.log('price per night', Math.ceil(price/Number($('#night').text())))
              document.querySelector('#perNight').innerText = Math.ceil(price/(Number($('#night').text())));
              priceString = priceString.split('');
              priceString.splice(-3, 0, ',');
              priceString = priceString.join('');
              document.querySelector('#calcPrice').innerText = priceString;
          } else {
              document.querySelector('#calcPrice').innerText = price;
              document.querySelector('#perNight').innerText = Math.round(price/Number($('#night').text()));
          }
          let total = (price + {{wf {&quot;path&quot;:&quot;cleaning-fee&quot;,&quot;type&quot;:&quot;Number&quot;\} }});



  				//processing fee code

  				procFee = procFee*total*0.01
  				$('#processing-fee').text(Math.round(procFee))

          if(!($('#percentage').hasClass('hidden')))$('#percentage').addClass('hidden');

          $('#dollar-sign').removeClass('hidden');


          total = Math.round(total + (total*{{wf {&quot;path&quot;:&quot;payment-processing-fee&quot;,&quot;type&quot;:&quot;Number&quot;\} }}*0.01))

           let totalString = total.toString();
          if(totalString.length > 3){
              totalString = totalString.split('');
              totalString.splice(-3, 0, ',');
              totalString = totalString.join('');
              document.querySelector('#total').innerText = totalString;
           } else {
           		let total = (price + {{wf {&quot;path&quot;:&quot;cleaning-fee&quot;,&quot;type&quot;:&quot;Number&quot;\} }});
              document.querySelector('#total').innerText = total;
          }
        }
    document.querySelector('.apartment-form__button').addEventListener('click', function(){
          let data = datepicker.getValue();
          data = data.split(' - ');
          let guests = document.querySelector('#guests').innerText;
          guests = Number(guests);
          if(data.length > 1 && guests > 0){
            document.location.href = `https://urbanstay.guestybookings.com/listings/{{wf {&quot;path&quot;:&quot;guesty-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}/book?endDate=${data[1]}&guests=${guests}&startDate=${data[0]}`;
          console.log(`https://urbanstay.guestybookings.com/listings/{{wf {&quot;path&quot;:&quot;guesty-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}/book?startDate=${data[0]}&endDate=${data[1]}&guests${guests}`)
          }
        });
       function parseData(){
          let dates = localStorage.getItem('bookDates');

          let totalGuest = localStorage.getItem('guestsNumber');

          if(dates.length > 0 && dates != null){
            let days = dateRange(dates);
            datepicker.setRange(days[0], days[1]);
            let result = datepicker.getValue();
            if(result.length > 0 && result != 'undefined'){
               splitData(dates);
              let nights = datepicker.getNights();
              showNights(nights);
            } else {
                localStorage.setItem('bookDates', '');
            }
          }
          if(totalGuest > 0){
            document.getElementById('guests').innerText = totalGuest;
          }
        }

        parseData();

        function dateRange(date){
          return date = date.split(' - ');
        }

        let bookDate = datepicker.getValue();
           if(bookDate != ''){
            bookDate = bookDate.split(' - ');
            let startData = {
              guesty: '{{wf {&quot;path&quot;:&quot;guesty-id&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}',
              startDate: bookDate[0],
              endDate: bookDate[1],
            };

          postMailData('https://andrew07.api.stdlib.com/guesty-test@dev/one-apart/', startData)
            .then((startData) => {
              let nights = datepicker.getNights();
              if(startData.available && startData.minNights <= nights){
                document.querySelector('.unval-dates').style.display = 'none';

                calculateTotal(startData);
              } else{
                document.querySelector('.unval-dates').style.display = 'block';

              }
            });
         }
    }
    showDatepicker();
      }

      const loadPicker = () => {
        if(localStorage.getItem("unavailableDates") !== ''){
        initDates = JSON.parse(localStorage.getItem("unavailableDates"));
        console.log('initDates ready', initDates)
          newPicker(initDates)
        }else{
            setTimeout(()=>{
            loadPicker();
          }, 500)
        }
      }

    loadPicker();
