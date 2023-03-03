
// let quantity_selectors = Array.from(document.getElementsByClassName("selectQuantity"));
// quantity_selectors.forEach(selector_elem => {
//     selector_elem.onchange = function(){console.log(selector_elem)}
// });

const ITEM_COSTS = Array.from(document.getElementsByClassName("cost"));
const TOTAL_COST_BOXES = document.getElementsByName("cost");
const RADIO_ELEMS = document.getElementsByName("p_or_d");
const ADDRESS_ELEMS = Array.from(document.getElementsByClassName("userInfo address"));
const MASS_TAX = 0.0625


function item_cost(item_index) {
    price = ITEM_COSTS[item_index].innerHTML;
    return parseFloat(price.substring(1, price.length))
}

function update_totals() {
    let subtotal = 0;
    TOTAL_COST_BOXES.forEach(element => {
        if (element.value) {
            subtotal += parseFloat(element.value);
        }
    });
    let tax = MASS_TAX * subtotal;
    let total = tax + subtotal;

    document.getElementById("subtotal").value = (subtotal).toFixed(2);
    document.getElementById("tax").value = (tax).toFixed(2);
    document.getElementById("total").value = (total).toFixed(2);
}

function add_quantity_event_handlers() {
    for (let i = 0; i < 5; i++) {
        let name = "quan" + i;
        let selector = document.getElementsByName(name)[0]
        selector.onchange = function(){
            let quantity = selector.value
            TOTAL_COST_BOXES[i].value = (quantity * item_cost(i)).toFixed(2);
            update_totals();
        }
    }
}

function get_quantities() {
    let quantities = []
    for (let i = 0; i < 5; i++) {
        let name = "quan" + i;
        let selector = document.getElementsByName(name)[0]
        quantities.push(parseInt(selector.value))
    }
    return quantities;
}

function add_submit_event_handler() {
    let button_elem = document.querySelectorAll('input[type=button]')[0];
    button_elem.onclick = handle_submit;
}

function delivery_radio_clicked() {
    let visibility = "hidden";
    if (is_delivery()) {
        visibility = "visible";
    }
    ADDRESS_ELEMS.forEach(element => {
        element.style.visibility = visibility;
    });
}

function add_radio_event_handlers() {
    console.log(RADIO_ELEMS)
    RADIO_ELEMS.forEach(element => {
        element.onclick = delivery_radio_clicked;
    });
    delivery_radio_clicked();
}

function is_delivery() {
    return RADIO_ELEMS[1].checked;
}

function calc_order_time() {
    let order_time = new Date();
    let prep_time = 15;
    if (is_delivery()) {
        prep_time = 45;
    }
    return new Date(order_time.getTime() + prep_time*60000); 
}

function validate_order() {
    let fname = document.getElementsByName("fname")[0].value
    let lname = document.getElementsByName("lname")[0].value
    let street = document.getElementsByName("street")[0].value
    let city = document.getElementsByName("city")[0].value
    let phone = Array.from(document.getElementsByName("phone")[0].value)
    let quantities = get_quantities();

    phone_length = 0;
    if (phone) {
        phone.forEach(c => {
            if (!isNaN(c)) {
                phone_length += 1;
            }
        });
    }
    console.log(phone, phone_length);
    console.log(quantities);

    
    if (!fname) {
        alert("ERROR: Please enter your first name");
    } else if (!lname) {
        alert("ERROR: Please enter your last name");
    } else if (is_delivery() && !street) {
        alert("ERROR: Please enter your street address");
    } else if (is_delivery() && !city) {
        alert("ERROR: Please enter your city");
    } else if (quantities.every(quan => quan == 0)) {
        alert("ERROR: You must order at least one item");
    } else if (phone_length != 10 && phone_length != 7) {
        alert("ERROR: Your phone number must include 7 or 10 digits");
    } else {
        return true;
    }
    return false;
}

function handle_submit() {
    const order_time = calc_order_time();
    if (validate_order()) {
        alert("Thank you for your order!");
        let newWindowObj = window.open("", "OrderConfirmation");
        newWindowObj.document.writeln("<h1>hello</h1>")
    }
}

add_quantity_event_handlers();
add_radio_event_handlers();
add_submit_event_handler();