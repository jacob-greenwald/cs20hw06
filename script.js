const ITEM_COSTS = Array.from(document.getElementsByClassName("cost"));
const TOTAL_COST_BOXES = document.getElementsByName("cost");
const RADIO_ELEMS = document.getElementsByName("p_or_d");
const ADDRESS_ELEMS = Array.from(document.getElementsByClassName("userInfo address"));
const ITEM_NAME_ELEMS = Array.from(document.getElementsByClassName("itemName"));
const MASS_TAX = 0.0625


function item_cost(item_index) {
    price = ITEM_COSTS[item_index].innerHTML;
    return parseFloat(price.substring(1, price.length))
}

function add_quantity_event_handlers() {
    for (let i = 0; i < 5; i++) {
        let name = "quan" + i;
        let selector = document.getElementsByName(name)[0]
        selector.onchange = function(){
            populate_totals();
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

function get_item_totals() {
    let item_totals = []
    for (let i = 0; i < 5; i++) {
        item_totals.push(TOTAL_COST_BOXES[i].value)
    }
    return item_totals;
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
    let new_time = new Date(order_time.getTime() + prep_time*60000);
    return new_time.getHours() + ":" + new_time.getMinutes() + ":" + new_time.getSeconds(); 
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

function populate_totals() {
    for (let i = 0; i < ITEM_NAME_ELEMS.length; i++) {
        let name = "quan" + i;
        let selector = document.getElementsByName(name)[0]

        let quantity = selector.value
        TOTAL_COST_BOXES[i].value = (quantity * item_cost(i)).toFixed(2);
    }

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

function handle_submit() {
    if (validate_order()) {
        alert("Thank you for your order!");
        let newWindowObj = window.open("", "_blank");

        newWindowObj.document.write("<h1>Order Details</h1>");
        newWindowObj.document.write("<table cellpadding='3'><tbody><tr><th>Item</th><th>Quantity</th><th>Total</th></tr>");

        let quantities = get_quantities();
        let item_totals = get_item_totals();
        for (let i = 0; i < ITEM_NAME_ELEMS.length; i++) {
            newWindowObj.document.write("<tr><td>"+ ITEM_NAME_ELEMS[i].innerHTML + "</td><td>"+ quantities[i] + "</td><td>"+ item_totals[i] + "</td></tr>");
        }
        newWindowObj.document.write("</tbody></table>");
        newWindowObj.document.write("<p>Subtotal: $" + document.getElementById("subtotal").value + "</p>");
        newWindowObj.document.write("<p>Tax: $" + document.getElementById("tax").value + "</p>");
        newWindowObj.document.write("<p>Total: $" + document.getElementById("total").value + "</p>");
        newWindowObj.document.write("<p>Your order will be ready at " + calc_order_time() + "</p>");
    }
}

function make_costs_read_only() {
    TOTAL_COST_BOXES.forEach(element => {
        element.setAttribute("readonly", "true");
    });
    document.getElementById("subtotal").setAttribute("readonly", true);
    document.getElementById("tax").setAttribute("readonly", true);
    document.getElementById("total").setAttribute("readonly", true);
}

make_costs_read_only();
populate_totals();
add_quantity_event_handlers();
add_radio_event_handlers();
add_submit_event_handler();