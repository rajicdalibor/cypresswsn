(function() {

    var gateway = null;
    var count = 0;

    class CypressWSN {
        constructor() {
            this.temperature = '';
            this.humidity = '';
            this.time = '';
            this.tempData = [];
            this.humidityData = [];

            this.peripherals = {};
            gateway = navigator.bluetooth.gateway;

            gateway.onstate = function(error) {
                if (gateway.state === C.kPoweredOn) {
                    gateway.scan(true);
                } else if (gateway.state === C.kPoweredOff) {
                    console.log('Please turn on the Bluetooth');
                } else if (gateway.state === C.kUnsupported) {
                    console.log('Bluetooth Low Energy is not supported with this device.');
                }
            };

            gateway.onscan = function(peripheral, error) {
                if (error) {
                    console.log(error.code + ': ' + error.message);
                    cypressWSN.onError(error.code + ': ' + error.message);
                    return;
                }
                var adv_data = peripheral.manufacturerData['0131'];
                if(adv_data){
                    adv_data = adv_data.toUpperCase();
                    if(adv_data.indexOf("0005000100001000800000805F9B0131") > -1){
                        if(!cypressWSN.peripherals[peripheral.uuid]){
                            peripheral.tempGraphData = [{ values: [], key: 'Temperature' }];
                            peripheral.humidityGraphData = [{ values: [], key: 'Humidity'}];
                        }

                        cypressWSN.peripherals[peripheral.uuid] = peripheral;
                        var data = adv_data.substr(adv_data.lastIndexOf("C3") - 4, 4);
                        var hex_humidity = data[0]+data[1]+'0'+'1';
                        var hex_temperature = data[2]+data[3]+'0'+'0';
                        var temperature = Math.round((parseInt(hex_temperature, 16)*175.72/65536-46.85)*100)/100;
                        var humidity = Math.round((parseInt(hex_humidity, 16)*125/65536-6)*100)/100;

                        var d = new Date();
                        var currDate = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

                        if(!isNaN(Number(temperature))){
                            cypressWSN.peripherals[peripheral.uuid].tempData = {
                                      timeNum: count,
                                      date: currDate,
                                      temp: Number(temperature)
                                  }
                        }
                        if(!isNaN(Number(humidity))){
                            cypressWSN.peripherals[peripheral.uuid].humidityData = {
                                      timeNum: count,
                                      date: currDate,
                                      temp: Number(humidity)
                                }
                        }
                        count++;

                        cypressWSN.time = currDate;
                        cypressWSN.peripherals[peripheral.uuid].temperature = temperature + ' °C';
                        cypressWSN.peripherals[peripheral.uuid].humidity = humidity + ' %rH';
                        cypressWSN.updateUI();
                    }
                }
            };           

            gateway.onerror = function(err_msg) {
                console.log(err_msg);
                cypressWSN.onError(err_msg);
            };
        }

        /* ------- cypressWSN Handling Functions ------- */

        getTemperature(){
            return this.temperature;
        };

        getHumidity(hex_humidity){
            return this.humidity;
        };
    }

  window.cypressWSN = new CypressWSN();
})();
