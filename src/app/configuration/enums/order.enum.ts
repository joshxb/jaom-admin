// This is an exported enum named 'Order' which has three possible values: Null, Asc, and Desc.
// The 'Null' value is an empty string, 'Asc' represents ascending order, and 'Desc' represents descending order.
export enum Order {
  Null = '', // 'Null' value is an empty string
  Asc = 'asc,', // 'Asc' represents ascending order
  Desc = 'desc', // 'Desc' represents descending order
}

// This is an exported enum named 'ItemsPerPage' which has six possible values: Null, Five, Ten, Twenty, Fifty, and Hundred.
// The 'Null' value is an empty string, 'Five' represents five items per page, 'Ten' represents ten items per page, and so on.
export enum ItemsPerPage {
  Null = '', // 'Null' value is an empty string
  Five = '5', // 'Five' represents five items per page
  Ten = '10', // 'Ten' represents ten items per page
  Twenty = '20', // 'Twenty' represents twenty items per page
  Fifty = '50', // 'Fifty' represents fifty items per page
  Hundred = '100' // 'Hundred' represents one hundred items per page
}
