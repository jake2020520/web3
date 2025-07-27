/// @dev Models a uint -> uint mapping where it is possible to iterate over all keys.
pragma solidity ^0.8.13;
interface MyLib{
    function getX()external returns(uint);
}
library IterableMapping
{
  struct itmap
  {
    mapping(uint => IndexValue) data;
    KeyFlag[] keys;
    uint size;
  }
  struct IndexValue { uint keyIndex; uint value; }
  struct KeyFlag { uint key; bool deleted; }
  function getX()public returns(uint){
      return 12;
  }
  function insert(itmap storage self, uint key, uint value) public returns (bool replaced)
  {
    uint keyIndex = self.data[key].keyIndex;
    self.data[key].value = value;
    if (keyIndex > 0)
      return true;
    else
    {
        uint index = self.keys.length;
      self.keys.push(KeyFlag(key, false));

      self.data[key].keyIndex = index;
      self.keys[index].key = key;
      self.size++;
      return false;
    }
  }
  function remove(itmap storage self, uint key) internal returns (bool success)
  {
    uint keyIndex = self.data[key].keyIndex;
    if (keyIndex == 0)
      return false;
    delete self.data[key];
    self.keys[keyIndex - 1].deleted = true;
    self.size --;
    return true;
  }
  function contains(itmap storage self, uint key) internal view returns (bool)
  {
    return self.data[key].keyIndex > 0;
  }
  function iterate_start(itmap storage self) internal view returns (uint )
  {
      uint keyIndex = 0;
    while (keyIndex < self.keys.length && self.keys[keyIndex].deleted)
      keyIndex++;
    return keyIndex;
  }
  function iterate_valid(itmap storage self, uint keyIndex) internal view returns (bool)
  {
    return keyIndex < self.keys.length;
  }
  function iterate_next(itmap storage self, uint keyIndex) internal view returns (uint r_keyIndex)
  {
    keyIndex++;
    while (keyIndex < self.keys.length && self.keys[keyIndex].deleted)
      keyIndex++;
    return keyIndex;
  }
  function iterate_get(itmap storage self, uint keyIndex) internal view returns (uint key, uint value)
  {
    key = self.keys[keyIndex].key;
    value = self.data[key].value;
  }
}

// How to use it:
contract User
{
  // Just a struct holding our data.
  IterableMapping.itmap data;
  // Insert something
  function insert(uint k, uint v) public returns (uint size)
  {
    // Actually calls itmap_impl.insert, auto-supplying the first parameter for us.
    IterableMapping.insert(data, k, v);
    // We can still access members of the struct - but we should take care not to mess with them.
    return data.size;
  }
  // Computes the sum of all stored data.
  function sum() public view returns (uint s)
  {
    for (uint i = IterableMapping.iterate_start(data); IterableMapping.iterate_valid(data, i); i = IterableMapping.iterate_next(data, i))
    {
         (uint key, uint value) = IterableMapping.iterate_get(data, i);
        s += value;
    }
  }
  function getX(address lib) public {
      lib.call(abi.encodeWithSignature("getX()"));
  }
}