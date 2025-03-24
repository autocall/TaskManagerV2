namespace TaskManager;
public partial interface Settings {
#if DEBUG
    public const string Site = "https://localhost:5173";
    /// <summary>
    ///      JWT Token Validation </summary>
    public const string PrivateKey = "bAafd@A7d9#@F4*V!LHZs#ebKQrkE6pad2f3kj34c3dXy@";
    public const string DefaultPassword = "123456";
    public const string MasterPassword = "tm123456";
    public const string FilePath = @"D:\TaskManager\TaskManager.Server\Data";
#endif
}