#### Ballot



#### [催眠大师课程](https://www.bilibili.com/video/BV1Ra411x7Gv/?spm_id_from=333.788)
```
string public myString = "hello world"; //public 会自动生成getter()

//变量类型
bool public b = true;
uint public u = 123;  //默认 uint256 0 to 2**256 -1
int public i = -123; //默认 256 -2**255 to 2**255 -1
int public minInt = type(int).min;
int public maxInt = type(int).max;

address public addr = 0x........; //20位16进制
bytes32 public byt = ......;

//运算
function add(uint x,uint y) external pure returns (uint){
    return x+y; //x-y
}

//状态变量
uint public myUint = 123;
function foo external {
    uint notStateVariable = 456; // 局部变量
}

//全局变量
function globalVars() external view returns (){
   address sender = msg.sender;//
   uint timestamp = block.timestamp;
   uint blockNum = block.number;
   return (sender,timestamp,blockNum)
}
//pure 只有局部变量不读链上信息， view 读了链上信息

//变量常量 constant 节省gas
address public constant MY_ADDRESS = ......; 

//ifelse 三元运算 
//循环控制
for(uint i=0;i<10;i++){
    if(i==3){
        continue; //跳过此次循环
    }
    if(i==5){
        break; //全部跳出循环
    }
}
while(j<10){
    j++;
}

//报错
contract Error {
    function testRequire(uint _i) public pure {
        require(_i<=10,"i>10")
    }
    function testRevert(uint _i) public pure {
        if(_i>10){
            revert("_i>10");
        }
    }
    uint public num=123
    function testAssert() public view {
        assert(num==123);//断言
    }

    error MyError(address caller,uint i);
    function testCustomError(uint _i) public view {
        if(_i>10){
            revert MyError(msg.sender,_i)
        }
    }
}

//函数修改器
modifier cap(uint _x){
    require(_x<100,"x>=100");
    _;
}
modifier sandwich(){
    count +=10;
    _;
    count *=2;
}
function incBy(uint _X) external cap(_x){
    count+=_x;
}

//构造函数 
//ownable合约 见contrackts/
//函数的输出
function returnMany() public pure returns (uint,bool){
    return (1,true)
}
function returnMany2() public pure returns (uint x,bool b){
    return (1,true)
}
function returnMany3() public pure returns (uint x,bool b){
    x=1;
    b=true;
}
function destructingAssigment() public {
    (,bool b) = returnMany();
}

//数组
uint[] public nums = [1,2,3];
uint[3] public numsFixed=[4,5,6];

function examples() external {
    nums.push(4),//[1,2,3,4]
    uint x= nums[1] //2
    nums[2] = 777; [1,2,777,4]
    delete nums[1]; [1,0,777,4]
    nums.pop();//[1,0,777]
    uint len=nums.length;

    //内存中创建数组 不能创建动态数组
    uint[] memory a=new uint[](5);
    a[1] = 123; 
}

function returnArray external view returns (uint[] memory) {
    return nums;
}

//删除数组中的元素 1 浪费gas
function remove(uint _index) public {
    require(_index<arr.length,"index out of bound");
    for(uint i= _index;i<arr.length;i++){
        arr[i] = arr[i+1];
    }
    arr.pop();
}
//删除数组中的元素 2 打乱顺序
function remove2(uint _index) public {
  require(_index<arr.length,"index out of bound");
  arr[_index] = arr[arr.length-1];
  arr.pop();
}
function test() external {
    arr= [1,2,3,4]
    remove2(1);
    assert(arr[2] == 4);
}

//映射 数据类型
contract Mapping {
    mapping(address =>uint) public balances;
    mapping(address=>mapping(address=>bool)) public isFriend;
    function examples() external {
        balances[msg.sender] = 123;
        uint bal = balances[msg,sender];
        uint bal2 = balances[address(1)]; //0
        balances[msg.sender]+=456; //579
        delete balances[msg.sender]; // 恢复到默认值 而不是真的删除

    }
}
contract IterableMapping {
    mapping(address=>uint) public balances;
    mapping(address=>bool) public inserted;
    address[] public keys;
    function set(address _key,uint _val) external {
        balances[_key] = _val;
        if(!inserted[_key]){
            inserted[_key] = true;
            keys.push(_key);
        }
    }

    function getSize() external view returns (uint) {
        return key.length;
    }
    function first() external view returns (uint){
        return balances[key[0]]
    }
    function last() external view returns (uint){
        return balances[key[keys.length-1]]
    }
    function get(uint _i) external view returns (uint){
        return balances[key[_i]]
    }
}

//结构体
contract Structs {
    struct Car {
        string model;
        uint year;
        address owner;
    }

    Car public car;
    Car[] public cars;
    mapping(address=>Car[]) public carsByOwner;
    function examples() external{
        Car memory toyota = Car("toyota",1990,msg.sender);
        Car memory lambo = Car({year:1998,model:"lanbo",owner:msg.sender});
        Car memory tesla;
        tesla.year = 2010;
        tesla.model = "tesla";
        tesla.owner = msg.sender;

        cars.push(toyota);
        cars.push(lambo);
        cars.push(tesla);

        cars.push(Car('Ferrari',2011,msg.sender));
        Car memory _car = cars[0];

        //
        Car storage __car = cars[0];
        __car.year = 1970;
        delete __car.owner;

        delete cars[1]

    }
}

//枚举
Contract Enum {
    enum Status {
        None,
        Pending,
        Shipped,
        Completed,
        Rejected,
        Canceled
    }
    Status public status;
    struct Order {
        address buyer;
        Status status;
    }
    Order[] public orders;

    function get() view external returns (Status){
        return status;
    }
    function set(Status _status) external {
        status=_status;
    }

    function ship() external {
        status = Status.Shipped;
    }
    function reset() external {
        delete status
    }
}

//通过合约部署合约 26跳过
constract Proxy {
    event Deploy(address)
}

//数据存储位置 storage memory calldata
contract DataLocation {
    struct MyStruct {
        uint foo;
        string text;
    }
    mapping(address=>MyStruct) public myStructs;
    function examples() external {
        myStructs[msg.sender] = MyStruct({foo:123,text:'bar'});
        MyStruct storage myStruct = myStructs[msg.sender]; //修改生效
        myStruct.text = "fooooo";
        MyStruct memory myStruct2 = myStructs[msg.sender]; //修改不生效
        myStruct2.text = "xxxxx";

    }

    //calldata 和memory类似  只在参数中使用 节约gas
    //function examples2(uint[] calldata y,string calldata s) external returns (uint[] memory){
    function examples2(uint[] memory y,string memory s) external returns (uint[] memory){
        myStructs[msg.sender] = MyStruct({foo:123,text:'bar'});
        MyStruct storage myStruct = myStructs[msg.sender]; //修改生效
        myStruct.text = "fooooo";
        MyStruct memory readonly = myStructs[msg.sender]; //修改不生效
        readonly.text = "xxxxx";

        uint memory memArr = new uint[](3);
        memArr[0] = 2345;
        return memArr;
    }
}

//待办事项练习 todolist

//事件  event
contract Event {
    event Log(string message,uint val);
    event IndexedLog(address indexed sender,uint val); 
    function example() external {
        emit Log("foo",1234);
        emit IndexedLog(msg,sender,789);
    }

    event Message(address indexed _from,address indexed _to,string message);
    function sendMessage(address _to,string calldata _s) external{
        emit Message(msg.sender,_to,_s)
    }
}

//继承 virtual override
contract A {
    function foo() public pure virtual returns (string memory) {
        return 'A'
    }
    function bar() public pure virtual returns (string memory) {
        return 'A'
    }
    function baz() public pure returns (string memory) {
        return 'A'
    }
}
contract B is A{
    function foo() public pure override returns (string memory) {
        return 'B'
    }
    function bar() public pure virtual override returns (string memory) {
        return 'B'
    }
}
contract C is B {
    function bar() public pure override returns (string memory) {
        return 'C'
    }
}
//多线继承 如果X是基层合约  
contract Z is X,Y{
    function foo() public pure override(X,Y) returns (sring memory){
        return 'Z'
    }
}

//运行父合约的构造函数
contract S {
    string public name;
    constructor(string memory _name){
        name = _name;
    }
}
contract T {
    string public text;
    constructor(string memory _text){
        text = _text;
    }
}

contract U is S('s'),T('t'){

}

contract V is S,T{ //先运行S的构造函数 再运行T
    constructor(string memory _name,string memory _text) S(_name) T(_text){}
}
contract VV is S('s'),T{
    constructor(string memory _text) T(_text){}
}


//如何调用父级合约函数
contract E {
    event Log(string message);
    function foo() public virtrual{
        emit Log('E.foo');
    }
    function bar() public virtual {
        emit Log('E.bar');
    }
}
contract F is E {
    function foo() public virtual override {
        emit Log('F.foo');
        E.foo()
    }
    function bar() public virtual override {
        emit Log('F.bar');
        super.bar(); //所有的父级合约bar都会被调用 且多次相互继承只调用一次
    }
}

//可视范围 
private ：不可继承，
internal ：可继承，
public ：
external:由调用合约的合约或个人地址来访问，内部无法直接访问，但通过this.externalFunc()可以访问 但浪费gas

//不可变量
contract Immutable{
    address public immutable owner = msg.sender
}
contract Immutable{
    address public immutable owner;
    constructor() {
        owner = msg.sender;
    }
}

//payable
contract Payable {
    address payable public  owner;
    constructor() {
        owner = payable(msg.sender);
    }
    function deposit() external payable {}
    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}

//回退函数 调用合约中不存在的函数的调用，并接受eth.。。receive只负责接受主币
有数据 fallback 没数据 receive，如果没有receive 则都调用fallback

contract Fallback{
    event Log(string func,address sender,uint value,string data);
    fallback() external payable{
        emit Log("fallback',msg.sender,msg.value,msg.data);
    }
    receive() external payable{
        emit Log("receive',msg.sender,msg.value,""); //不接受数据
    }
}

//发送eth
/**
transfer 2300gas reverts
send 2300 gas returns bool
call all gas returns bool and data
*/
contract SendEther {
    constructor() payable {}
    receive() external payable{}
    function sendViaTransfer(address payable _to) external payable{
        _to.transfer(123); //123 wei
    }
    function sendViaSend(address payable _to) external payable{
        bool sent = _to.send(123);
        require(sent,"send failed")
    }
    function sendViaCall(address payable _to) external payable{
        (bool success,) = _to.call{value:123}(""); //发送的数据
        require(success,"call failed")
    }
}

contract EthReceiver {
    event Log(uint amount ,uint gas);

    receive() external payable{
        emit Log(msg.value,gasleft());
    }
}

//钱包合约 总价 etherwallet.sol

//通过合约调用其他合约

contract CallTestContract {
    function setX(TestContract _test,uint _x) external {
        _test.setX(_x);
    }
    function getX(address _test) external view returns (uint x) {
        x = TestContract(_test).getX();
    }
    function setXandSendEther(address _test,uint _x) external payable {
        TestContract(_test).setXandReceiveEther{value:msg.value}(_x)
    }
    function getXandValue(address _test,uint _x) external view returns (uint,uint){
        (uint x,uint value) = TestContract(_test).getXandValue()
    }

}

contract TestContract {
    uint public x;
    uint public value =123;
    function setX(uint _x) external{
        x= _x;
    }
    function getX() external view returns (uint){
        return x;
    }
    function setXandReceiveEther(uint _x) external payable {
        x = _x;
        value = msg.value;
    }
    function getXandValue() external view returns (uint,uint){
        return (x,value)
    }
}

//接口
//counter合约文件
contract Counter {
    uint public count;
    function inc() external {
        count +=1;
    }
    function dec() external {
        count -=1;
    }
}
//CallInterface测试合约
interface ICounter {
    function count() external view returns(uint);
    function inc() external;
}
contract CallInterface {
    uint public count;
    function examples(address _counter) external{
        ICounter(_counter).inc();
        count = ICounter(_counter).count();
    }
}

// *********** 低级调用Call  abi.encodeWithSignature ***********
contract TestCall {
    string public message;
    uint public x;
    event Log(string message);
    fallback() external payable {
        emit Log("fallback was called.");
    }
    function foo(string memory _message,uint _x) external payable returns (bool,uint){
        message = _message;
        x = _x;
        return (true,999);
    }
}

contract Call {
    bytes public data;
    function callFoo(address _test) external {
        //gas5000 太少会报错。
        (bool success,bytes memory _data) = _test.call{value:111,gas:5000}(abi.encodeWithSignature("foo(string,uint256)","call fooo",123));
        require(success,"call failed");
        data = _data
    }

    function callDoesNotExit(address _test) external {
        //处罚fallback
       (bool success,) = _test.call(abi.encodeWithSignature("doseNotExist()"));
       require(success,"fallback not be called");

    }

}

// *********** 委托调用 delegateCall ***********
/**
普通调用：
A calls B,send 100 wei
B calls C,send 50 wei
A-->B-->C
msg.sender = B
msg.value =50
execute code on C's state variables
use Eth in C

委托调用
A calls B,sender 100 wei
B delegatecall C
A-->B-->C
msg.sender = A
msg.value =100
execute code on B's state variables
use Eth in B
*/

contract TestDelegateCall{
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) external payable{
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}
contract DelegateCall {
    uint public num;
    address public sender;
    uint public value;
    function setVars(address _test,uint _num) external payable {
        /** 等同于encodeWithSelect
        _test.delegatecall(
            abi.encodeWithSignature("setVars(uint256)",_num)
        )
        */
        (bool success,bytes memory data) = _test.delegatecall(abi.encodeWithSelect(TestDelegateCall.setVars.selector,_num));
        require(success,"delegetedcall failed");

    }
}

// 最终改变的是合约 DelegateCall中的状态，等于把处理逻辑单独拿出去，委托给TestDelegateCall 来处理DelegateCall的状态


// *********** 工厂合约 ***********

contract Account {
    address public bank;
    address public owner;
    constructor(address _owner) payable {
        bank = msg.sender;
        owner = _owner;
    }
}

constract AccountFactory {
    Account[] public accounts;
    function createAccount(address _owner) external payable{
        Account account = new Account{value:msg.value}(_owner);
        accounts.push(accounts)
    }
}

// ********** 库合约 **************
eg1.
library Math {
    function max(uint x,uint y) internal {
        return x>=y?x:y;
    }
}
contract Test {
    function testMax(uint x,uint y) external pure returns (uint) {
        return Math.max(x,y);
    }
}

eg2.
library ArrayLib {
    function find(uint[] storage arr,uint x) internal view returns (uint) {
        for(uint i=0;i<arr.length;i++){
            if(arr[i]==x) {
                return i;
            }
        }
        revert("not found");
    }
}
contract TestArray {
    using ArrayLib for uint[];
    uint[] public arr= [2,3,4,5];

    function testFind() external view returns(uint i){
        //return ArrayLib.find(arr,2);
        //前面使用了using for,可以这样写：
        return arr.find(2);
    }
}

```

##### part2

```
// ********** 哈希算法 keccak256 **************
/**
输入值相同，输出值一定相同。输入值不管多大，输出值是等长的。byte32

abi.encodePacked 不会补0
abi.encode
*/
contract HashFunc {
    function hash(string memory text,uint num,address addr) external pure returns(bytes32){
        return keccak256(abi.encodePacked(text,num,addr));
    }
    function encode(string memory text0,string memory test1) external pure returns(uint){
        return abi.encode(text0,text1);
    }
    function encodePacked(string memory text0,string memory test1) external pure returns(uint){
        return abi.encodePacked(text0,text1);
    }
    //encodePacked('AAA','BBB') == encodePacked('AAAB','BB'); 发生碰撞
}

// ********** 验证签名 **************

contract VerifySig {
    function verify(address _signer,string memory _message,bytes memory _sig) external pure returns (bool){
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recover(ethSignedMessageHash,_sig) == _signer;
    }

    function getMessageHash(string memory _message) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_message));
    }
    function getEthSignedMessageHash(bytes32 _message) public pure returns(bytes32){
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",_message));
    }

    function recover(bytes32 _ethSignedMessageHash,bytes memory _sig) public pure returns (address){
        (bytes32 r,bytes32 s,uint8 v) = _split(_sig);
       return ecrecover(_ethSignedMessageHash,v,r,s);
    }
    function _split(bytes memory _sig) internal pure returns (bytes32 r,bytes32 s,uint8 v) {
        /**
         使用内联汇编
        */
        require(_sig.length == 65,"invalid!");
        assembly {
            r := mload(add(_sig,32))
            s := mload(add(_sig,64))
            v := byte(0,mload(add(_sig,96)))
        }
    }
}

//链下生成sig的方法。
0、_message ="test message"
1、messageHash = getMessageHash(_message);
2、chrome console:
   ethereum.enable();//获得签名地址 _account
   _sig = ethereum.request({method:"personal_sign",params:[_account,messageHash]});
3、得到了 _message _sig  _account

//******** 权限控制合约 *********
contract AccessControl {
    event GrantRole(bytes32 indexed role,address indexed account);
    event RevokeRole(bytes32 indexed role,address indexed account);
    mapping(bytes32 =>mapping(address=>bool)) public roles;
    bytes32 private constant ADMIN = keccak256(abi.encodePacked("ADMIN"));
    bytes32 private constant USER = keccak256(abi.encodePacked("USER"));

    modifier onlyRole(bytes32 _role){
        require(roles[_role][msg.sender],"not authorized");
        _;
    }

    constructor() {
        _grantRole(ADMIN,msg.sender);
    }
    function _grantRole(bytes _role,address _account) internal {
        roles[_role][_account] = true;
        emit GrantRole(_role,_account);
    }
    function grantRole(bytes _role,address _account) internal onlyRole(ADMIN) {
        _grantRole(_role,_account);
    }

    function _revokeRole(bytes _role,address _account) internal {
        roles[_role][_account] = false;
        emit RevokeRole(_role,_account);
    }
    function revokeRole(bytes _role,address _account) internal onlyRole(ADMIN) {
        _revokeRole(_role,_account);
    }

}

```
