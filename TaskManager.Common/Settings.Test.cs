namespace TaskManager;
public partial interface Settings {
#if TEST
    public const string Site = "https://localhost:7090";
    public const string PrivateKey = "bAafd@A7d9#@F4*V!LHZs#ebKQrkE6pad2f3kj34c3dXy@";
    public const string DefaultPassword = "123456";
    public const string MasterPassword = "tm123456";
    public const string FilePath = @"\Files\";
#endif
}