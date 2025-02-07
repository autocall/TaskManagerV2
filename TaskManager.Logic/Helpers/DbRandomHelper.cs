using System.Security.Cryptography;
using TaskManager.Common;

namespace TaskManager.Logic.Helpers;
/// <summary>
///     The class generates unique number values optimized for database indexing to prevent page splits </summary>
public class DbRandomHelper {
    private static readonly object _lock = new object();
    private const int COUNT_VALUES64 = 10000;
    private const int COUNT_VALUES32 = 1000;
    private const int COUNT_VALUES16 = 100;

    private static long LastInt64Value = default;
    private static int LastInt32Value = default;
    private static ushort LastUInt16Value = default;

    private static int CountInt64Value = Int32.MaxValue;
    private static int CountInt32Value = Int32.MaxValue;
    private static int CountUInt16Value = Int32.MaxValue;

    public static long NewInt64() {
        if (CountInt64Value > COUNT_VALUES64) {
            LastInt64Value = _newInt64();
            CountInt64Value = 0;
        }
        lock (_lock) {
            CountInt64Value++;
            LastInt64Value++;
            return LastInt64Value;
        }
    }
    public static int NewInt32() {
        if (CountInt32Value > COUNT_VALUES32) {
            LastInt32Value = _newInt32();
            CountInt32Value = 0;
        }
        lock (_lock) {
            CountInt32Value++;
            LastInt32Value++;
            return LastInt32Value;
        }
    }
    public static ushort NewUInt16() {
        if (CountUInt16Value > COUNT_VALUES16) {
            LastUInt16Value = _newUInt16();
            CountUInt16Value = 0;
        }
        lock (_lock) {
            CountUInt16Value++;
            LastUInt16Value++;
            return LastUInt16Value;
        }
    }

    private static long _newInt64() {
        var buf8 = new byte[8];
        RandomNumberGenerator.Create().GetBytes(buf8);
        var val = BitConverter.ToInt64(buf8, 0);
        if (val == 0) {
            _l.w("new Random Object[1]");
            return _newInt64();
        }
        return val;
    }
    private static int _newInt32() {
        var buf4 = new byte[4];
        RandomNumberGenerator.Create().GetBytes(buf4);
        var val = BitConverter.ToInt32(buf4, 0);
        if (val == 0) {
            _l.w("new Random Object[2]");
            return _newInt32();
        }
        return val;
    }
    private static ushort _newUInt16() {
        var buf2 = new byte[2];
        RandomNumberGenerator.Create().GetBytes(buf2);
        var val = BitConverter.ToUInt16(buf2, 0);
        if (val == 0) {
            _l.w("new Random Object[3]");
            return _newUInt16();
        }
        return val;
    }
}
